package ws_server

import (
	"emperror.dev/errors"
	"encoding/json"
)

func (c *WsController) messageTyping(cli *Client, raw json.RawMessage) error {
	_, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	isOperator, ok := cli.IsOperator()
	if !ok {
		return errors.New("not authorized")
	}

	request := struct {
		ChatID int64 `json:"chat_id"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	response := struct {
		IsOperator bool  `json:"is_operator"`
		ChatID     int64 `json:"chat_id"`
	}{
		IsOperator: isOperator,
		ChatID:     request.ChatID,
	}

	rawResponse, err := json.Marshal(response)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.BroadcastToChat(request.ChatID, WSMessage{
		Op:   OpMessageTypingSuccess,
		Data: rawResponse,
	})
	return nil
}
