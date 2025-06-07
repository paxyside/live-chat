package ws_server

import (
	"chat_backend/internal/domain/infrastructure/logger"
	"log/slog"
	"sync"

	"github.com/gorilla/websocket"
)

type Manager interface {
	Register(client *Client)
	Unregister(client *Client)
	Authorize(client *Client, tgID int64, isOperator bool)
	JoinChat(client *Client, chatID int64)
	BroadcastToChat(chatID int64, msg WSMessage)
	BroadcastToOperators(msg WSMessage)
	GetClientByConn(conn *websocket.Conn) *Client
	GetOperators() []*Client
	GetClientsByChat(chatID int64) []*Client
}

type WsManager struct {
	mu           sync.RWMutex
	l            logger.Loggerer
	clients      map[*Client]struct{}
	connToClient map[*websocket.Conn]*Client
}

func NewWsManager(l logger.Loggerer) *WsManager {
	return &WsManager{
		l:            l,
		clients:      make(map[*Client]struct{}),
		connToClient: make(map[*websocket.Conn]*Client),
	}
}

func (m *WsManager) Register(client *Client) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.clients[client] = struct{}{}
	m.connToClient[client.Connection().Raw()] = client
}

func (m *WsManager) Unregister(client *Client) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.clients, client)
	delete(m.connToClient, client.Connection().Raw())
}

func (m *WsManager) Authorize(client *Client, tgID int64, isOperator bool) {
	client.SetIdentity(&tgID, &isOperator)
}

func (m *WsManager) JoinChat(client *Client, chatID int64) {
	client.SetActiveChat(chatID)
}

func (m *WsManager) BroadcastToChat(chatID int64, msg WSMessage) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for client := range m.clients {
		if client.InChat(chatID) {
			if err := client.Send(&msg); err != nil {
				m.l.Error("broadcast to chat failed", slog.Any("err", err))
			}
		}
	}
}

func (m *WsManager) BroadcastToOperators(msg WSMessage) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for client := range m.clients {
		isOp, ok := client.IsOperator()
		if !ok {
			continue
		}

		if isOp {
			if err := client.Send(&msg); err != nil {
				m.l.Error("broadcast to operator failed", slog.Any("err", err))
			}
		}
	}
}

func (m *WsManager) GetClientByConn(conn *websocket.Conn) *Client {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.connToClient[conn]
}

func (m *WsManager) GetOperators() []*Client {
	m.mu.RLock()
	defer m.mu.RUnlock()
	var ops []*Client
	for client := range m.clients {
		isOp, ok := client.IsOperator()
		if !ok {
			continue
		}

		if isOp {
			ops = append(ops, client)
		}
	}
	return ops
}

func (m *WsManager) GetClientsByChat(chatID int64) []*Client {
	m.mu.RLock()
	defer m.mu.RUnlock()
	var res []*Client
	for client := range m.clients {
		if client.InChat(chatID) {
			res = append(res, client)
		}
	}
	return res
}
