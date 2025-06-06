package ws_server

import (
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) messageDelete(ctx context.Context, cli *Client, raw json.RawMessage) error {
	if cli.Meta.TelegramID == nil {
		return errors.New("not authorized")
	}

	request := struct {
		ChatID    int64 `json:"chat_id"`
		MessageID int64 `json:"message_id"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	msg, err := c.svc.MarkMessageAsDeleted(ctx, request.MessageID)
	if err != nil {
		return errors.Wrap(err, "c.svc.MarkMessageAsDeleted")
	}

	rawMsg, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.Broadcast(request.ChatID, WSMessage{
		Op:   OpMessageDeleteSuccess,
		Data: rawMsg,
	})

	return nil
}
