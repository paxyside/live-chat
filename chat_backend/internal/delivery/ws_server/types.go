package ws_server

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"sync"
)

type WSMessage struct {
	Op   string          `json:"op"`
	Data json.RawMessage `json:"data"`
}

type Connection struct {
	mu   sync.Mutex
	conn *websocket.Conn
}

func NewConnection(conn *websocket.Conn) *Connection {
	return &Connection{conn: conn}
}

func (c *Connection) Raw() *websocket.Conn {
	return c.conn
}

func (c *Connection) WriteJSON(v any) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.conn.WriteJSON(v)
}

func (c *Connection) WriteMessage(msg int, data []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.conn.WriteMessage(msg, data)
}

func (c *Connection) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.conn.Close()
}

type Identity struct {
	TelegramID *int64
	IsOperator *bool
}

func (i *Identity) Update(tgID *int64, isOperator *bool) {
	i.TelegramID = tgID
	i.IsOperator = isOperator
}
