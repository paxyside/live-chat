package ws_server

import (
	"context"
	"emperror.dev/errors"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	mu sync.RWMutex

	conn     *Connection
	identity *Identity

	msgChan chan *WSMessage

	activeChat int64
	chatIDs    map[int64]struct{}
}

func NewClient(ctx context.Context, conn *websocket.Conn) *Client {
	c := &Client{
		conn:     NewConnection(conn),
		identity: &Identity{},
		msgChan:  make(chan *WSMessage, 256),
		chatIDs:  make(map[int64]struct{}),
	}
	go c.writePump(ctx)
	return c
}

func (c *Client) SetActiveChat(chatID int64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.activeChat = chatID
	c.chatIDs[chatID] = struct{}{}
}

func (c *Client) ActiveChat() int64 {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.activeChat
}

func (c *Client) ChatIDs() map[int64]struct{} {
	c.mu.RLock()
	defer c.mu.RUnlock()

	copied := make(map[int64]struct{}, len(c.chatIDs))
	for k, v := range c.chatIDs {
		copied[k] = v
	}
	return copied
}

func (c *Client) InChat(chatID int64) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	_, ok := c.chatIDs[chatID]
	return ok
}

// --- Методы доступа ---

func (c *Client) Connection() *Connection {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.conn
}

func (c *Client) Identity() *Identity {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.identity
}

func (c *Client) TelegramID() (int64, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	return *c.identity.TelegramID, c.identity.TelegramID != nil
}

func (c *Client) IsOperator() (bool, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	return *c.identity.IsOperator, c.identity.IsOperator != nil
}

func (c *Client) SetIdentity(tgID *int64, isOperator *bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.identity.Update(tgID, isOperator)
}

// --- Работа с сообщениями ---

func (c *Client) SendMessage(msg int, data []byte) error {
	return c.Connection().WriteMessage(msg, data)
}

func (c *Client) Send(msg *WSMessage) error {
	select {
	case c.msgChan <- msg:
		return nil
	default:
		return errors.New("client message channel is full")
	}
}

func (c *Client) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	select {
	case <-c.msgChan:
	default:
	}
	close(c.msgChan)
	if err := c.conn.Close(); err != nil {
		return errors.Wrap(err, "c.conn.Close")
	}
	return nil
}

func (c *Client) writePump(ctx context.Context) {
	for {
		select {
		case msg, ok := <-c.msgChan:
			if !ok {
				return
			}
			if err := c.conn.WriteJSON(msg); err != nil {
				return
			}
		case <-ctx.Done():
			return
		}
	}
}
