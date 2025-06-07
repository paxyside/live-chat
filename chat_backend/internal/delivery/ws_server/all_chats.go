package ws_server

import (
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) allChats(ctx context.Context, cli *Client) error {
	_, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	isOperator, ok := cli.IsOperator()
	if !ok {
		return errors.New("not authorized")
	}

	if !isOperator {
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
