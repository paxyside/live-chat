package ws_server

import (
	"chat_backend/internal/domain"
	"chat_backend/internal/domain/infrastructure/logger"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"emperror.dev/errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/spf13/viper"
)

type WsController struct {
	l logger.Loggerer

	connections Manager
	svc         domain.Service
}

func NewWsController(l logger.Loggerer, connections Manager, svc domain.Service) *WsController {
	return &WsController{
		l:           l,
		connections: connections,
		svc:         svc,
	}
}

func (c *WsController) Entrypoint(gCtx *gin.Context) {
	wsUpgrader := websocket.Upgrader{
		ReadBufferSize:  viper.GetInt("app.server.ws.read_buffer_size"),
		WriteBufferSize: viper.GetInt("app.server.ws.write_buffer_size"),
		CheckOrigin:     func(*http.Request) bool { return true },
	}

	conn, err := wsUpgrader.Upgrade(gCtx.Writer, gCtx.Request, nil)
	if err != nil {
		c.l.Error("failed to upgrade websocket", slog.Any("error", err))
		return
	}

	ctx, cancel := context.WithCancel(gCtx.Request.Context())
	defer cancel()

	c.HandleConnection(ctx, conn)
}

func (c *WsController) HandleConnection(ctx context.Context, conn *websocket.Conn) {
	stopSig := make(chan struct{})

	client := NewClient(ctx, conn)

	c.connections.Register(client)

	defer func() {
		c.connections.Unregister(client)
		if err := client.Close(); err != nil {
			c.l.Error("failed to close connection", slog.Any("error", err))
		}

		close(stopSig)
	}()

	conn.SetReadLimit(viper.GetInt64("app.server.ws.read_limit"))

	if err := conn.SetReadDeadline(time.Now().Add(viper.GetDuration("app.server.ws.read_deadline"))); err != nil {
		c.l.Error("failed to set read deadline", slog.Any("error", err))
		return
	}

	conn.SetPongHandler(func(string) error {
		if err := conn.SetReadDeadline(time.Now().Add(viper.GetDuration("app.server.ws.read_deadline"))); err != nil {
			c.l.Error("failed to set read deadline", slog.Any("error", err))
			return errors.Wrap(err, "conn.SetReadDeadline")
		}
		return nil
	})

	go func() {
		ticker := time.NewTicker(viper.GetDuration("app.server.ws.ping_interval"))
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				if err := client.SendMessage(websocket.PingMessage, nil); err != nil {
					if err = client.Close(); err != nil {
						c.l.Error("failed to close connection", slog.Any("error", err))
					}

					c.l.Error("failed to write ping message", slog.Any("error", err))
					return
				}
			case <-stopSig:
				return
			}
		}
	}()

	for {
		select {
		case <-stopSig:
			return
		case <-ctx.Done():
			return

		default:
			_, raw, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					c.l.Error("unexpected close error", slog.Any("error", err))
					return
				}
				c.l.Error("failed to read message", slog.Any("error", err))
				return
			}

			if err = c.HandleMessage(ctx, client, raw); err != nil {
				c.l.Error("failed to handle message", slog.Any("error", err))
				return
			}
		}
	}
}

func (c *WsController) HandleMessage(ctx context.Context, client *Client, raw []byte) error {
	msg := new(WSMessage)

	if err := json.Unmarshal(raw, msg); err != nil {
		if err = c.sendErrorMessage(client, OpInvalidData, err); err != nil {
			return errors.Wrap(err, "c.sendErrorMessage")
		}

		return errors.Wrap(err, "json.Unmarshal")
	}

	switch msg.Op {
	case OpAuth:
		return c.exec(client, OpAuthError, func() error {
			return c.authClient(ctx, client, msg.Data)
		})
	case OpAllChats:
		return c.exec(client, OpAllChatsError, func() error {
			return c.allChats(ctx, client)
		})
	case OpChatOpen:
		return c.exec(client, OpChatOpenError, func() error {
			return c.chatOpen(ctx, client, msg.Data)
		})
	case OpMessageSend:
		return c.exec(client, OpMessageSendError, func() error {
			return c.sendMessage(ctx, client, msg.Data)
		})
	case OpMessageEdit:
		return c.exec(client, OpMessageEditError, func() error {
			return c.messageEdit(ctx, client, msg.Data)
		})
	case OpMessageRead:
		return c.exec(client, OpMessageReadError, func() error {
			return c.messageRead(ctx, client, msg.Data)
		})
	case OpMessageDelete:
		return c.exec(client, OpMessageDeleteError, func() error {
			return c.messageDelete(ctx, client, msg.Data)
		})
	case OpMessageTyping:
		return c.exec(client, OpMessageTypingError, func() error {
			return c.messageTyping(client, msg.Data)
		})
	default:
		if err := c.sendErrorMessage(client, OpUnknownOp, errors.New("unknown operation: "+msg.Op)); err != nil {
			return errors.Wrap(err, "c.sendErrorMessage")
		}
	}

	return nil
}

func (c *WsController) exec(client *Client, op string, fn func() error) error {
	if err := fn(); err != nil {
		if err = c.sendErrorMessage(client, op, err); err != nil {
			return errors.Wrap(err, "c.sendErrorMessage")
		}
		return errors.Wrap(err, "exec")
	}
	return nil
}

func (c *WsController) sendSuccessMessage(client *Client, op string, data json.RawMessage) error {
	return client.Send(
		&WSMessage{
			Op:   op,
			Data: data,
		})
}

func (c *WsController) sendErrorMessage(client *Client, op string, err error) error {
	rawMessage := fmt.Sprintf(`{"error": "%s"}`, err.Error())

	return client.Send(
		&WSMessage{
			Op:   op,
			Data: json.RawMessage(rawMessage),
		})
}
