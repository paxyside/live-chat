package ws_server

import "encoding/json"

type WSMessage struct {
	Op   string          `json:"op"`
	Data json.RawMessage `json:"data"`
}
