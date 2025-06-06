package ws_server

import (
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) allChats(ctx context.Context, cli *Client) error {
	if cli.Meta.TelegramID == nil {
		return errors.New("not authorized")
	}

	if cli.Meta.IsOperator != nil && !*cli.Meta.IsOperator {
		return errors.New("only for operators")
	}

	chats, err := c.svc.ListAllChats(ctx)
	if err != nil {
		return errors.Wrap(err, "c.svc.ListAllChats")
	}

	rawChats, err := json.Marshal(chats)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	if err = c.sendSuccessMessage(cli, OpAllChatsSuccess, rawChats); err != nil {
		return errors.Wrap(err, "c.sendSuccessMessage")
	}

	return nil
}
