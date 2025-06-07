package ws_server

import (
	"chat_backend/internal/domain"
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) sendMessage(ctx context.Context, cli *Client, raw json.RawMessage) error {
	tgID, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	isOperator, ok := cli.IsOperator()
	if !ok {
		return errors.New("not authorized")
	}

	request := struct {
		ChatID     int64  `json:"chat_id"`
		Content    string `json:"content"`
		IsOperator bool   `json:"is_operator"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	msg, err := c.svc.CreateMessage(ctx, request.ChatID, tgID, request.Content, request.IsOperator)
	if err != nil {
		return errors.Wrap(err, "c.svc.CreateMessage")
	}

	rawMsg, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.BroadcastToChat(request.ChatID, WSMessage{
		Op:   OpMessageNew,
		Data: rawMsg,
	})

	var chats []domain.ChatWithLastMessage

	if !isOperator {
		chats, err = c.svc.ListAllChats(ctx)
		if err != nil {
			return errors.Wrap(err, "c.svc.ListAllChats")
		}

		rawChats, err := json.Marshal(chats)
		if err != nil {
			return errors.Wrap(err, "json.Marshal")
		}

		c.connections.BroadcastToOperators(WSMessage{
			Op:   OpAllChatsSuccess,
			Data: rawChats,
		})
	}

	return nil
}
