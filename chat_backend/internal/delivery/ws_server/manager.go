package ws_server

import (
	"chat_backend/internal/domain/infrastructure/logger"
	"log/slog"
	"sync"

	"github.com/gorilla/websocket"
)

type Manager interface {
	Add(conn *websocket.Conn)
	Remove(conn *websocket.Conn)
	Authorize(conn *websocket.Conn, tgID int64, isOperator bool)
	JoinChat(client *Client, chatID int64)
	Broadcast(chatID int64, msg WSMessage)
	BroadcastToOperator(msg WSMessage)
	GetClient(conn *websocket.Conn) *Client
}

type WsManager struct {
	mu sync.RWMutex
	l  logger.Loggerer

	connections         map[*websocket.Conn]*Client
	operatorConnections map[*websocket.Conn]int64
	chatClients         map[int64][]*Client
}

func NewWsManager(l logger.Loggerer) *WsManager {
	return &WsManager{
		l:                   l,
		connections:         make(map[*websocket.Conn]*Client),
		operatorConnections: make(map[*websocket.Conn]int64),
		chatClients:         make(map[int64][]*Client),
	}
}

func (w *WsManager) Add(conn *websocket.Conn) {
	w.mu.Lock()
	defer w.mu.Unlock()

	client := NewClient(conn)
	w.connections[conn] = client
}

func (w *WsManager) Remove(conn *websocket.Conn) {
	w.mu.Lock()
	defer w.mu.Unlock()

	client, ok := w.connections[conn]
	if !ok {
		return
	}

	for chatID, clients := range w.chatClients {
		for i, c := range clients {
			if c == client {
				w.chatClients[chatID] = append(clients[:i], clients[i+1:]...)
				break
			}

			if len(w.chatClients[chatID]) == 0 {
				delete(w.chatClients, chatID)
			}
		}
	}

	delete(w.operatorConnections, conn)
	delete(w.connections, conn)
}

func (w *WsManager) Authorize(conn *websocket.Conn, tgID int64, isOperator bool) {
	w.mu.Lock()
	defer w.mu.Unlock()

	client, ok := w.connections[conn]
	if !ok {
		return
	}

	client.Meta.TelegramID = &tgID
	client.Meta.IsOperator = &isOperator

	w.chatClients[tgID] = append(w.chatClients[tgID], client)

	if isOperator {
		w.operatorConnections[conn] = tgID
	}
}

func (w *WsManager) JoinChat(client *Client, chatID int64) {
	w.mu.Lock()
	defer w.mu.Unlock()

	for _, c := range w.chatClients[chatID] {
		if c == client {
			return
		}
	}

	w.chatClients[chatID] = append(w.chatClients[chatID], client)
}

func (w *WsManager) Broadcast(chatID int64, msg WSMessage) {
	w.mu.RLock()
	defer w.mu.RUnlock()

	clients := w.chatClients[chatID]

	for _, client := range clients {
		if err := client.SafeWriteJSON(msg); err != nil {
			w.l.Error("Error broadcasting message to client", slog.Any("error", err))
			continue
		}
	}
}

func (w *WsManager) BroadcastToOperator(msg WSMessage) {
	w.mu.RLock()
	defer w.mu.RUnlock()

	for conn := range w.operatorConnections {
		client, ok := w.connections[conn]
		if !ok {
			continue
		}

		if err := client.SafeWriteJSON(msg); err != nil {
			w.l.Error("Error broadcasting message to operator", slog.Any("error", err))
			continue
		}
	}
}

func (w *WsManager) GetClient(conn *websocket.Conn) *Client {
	w.mu.RLock()
	defer w.mu.RUnlock()

	return w.connections[conn]
}
