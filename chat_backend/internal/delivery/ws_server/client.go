package ws_server

import (
	"sync"

	"github.com/gorilla/websocket"
)

type ClientMeta struct {
	TelegramID *int64
	IsOperator *bool
}

type Client struct {
	mu   sync.Mutex
	conn *websocket.Conn
	Meta *ClientMeta
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{conn: conn, Meta: &ClientMeta{}}
}

func (c *Client) SafeWriteJSON(v any) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.conn.WriteJSON(v)
}

func (c *Client) SafeWriteMessage(msgType int, data []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.conn.WriteMessage(msgType, data)
}

func (c *Client) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.conn.Close()
}

func (c *Client) RemoteAddr() string {
	return c.conn.RemoteAddr().String()
}
