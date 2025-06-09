package ws_server

import (
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) messageEdit(ctx context.Context, cli *Client, raw json.RawMessage) error {
	_, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	request := struct {
		ChatID    int64  `json:"chat_id"`
		MessageID int64  `json:"message_id"`
		Content   string `json:"content"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	msg, err := c.svc.EditMessage(ctx, request.MessageID, request.Content)
	if err != nil {
		return errors.Wrap(err, "c.svc.EditMessage")
	}

	rawMsg, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.BroadcastToChat(request.ChatID, WSMessage{
		Op:   OpMessageEditSuccess,
		Data: rawMsg,
	})

	return nil
}
