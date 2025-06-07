package ws_server

import (
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) messageRead(ctx context.Context, cli *Client, raw json.RawMessage) error {
	_, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	isOperator, ok := cli.IsOperator()
	if !ok {
		return errors.New("not authorized")
	}

	request := struct {
		ChatID    int64 `json:"chat_id"`
		MessageID int64 `json:"message_id"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	msg, err := c.svc.MarkMessageAsRead(ctx, request.MessageID, isOperator)
	if err != nil {
		return errors.Wrap(err, "c.svc.MarkMessageAsRead")
	}

	rawMsg, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.BroadcastToChat(request.ChatID, WSMessage{
		Op:   OpMessageReadSuccess,
		Data: rawMsg,
	})

	return nil
}
