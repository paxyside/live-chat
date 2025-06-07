package ws_server

import (
	"chat_backend/internal/usecase"
	"context"
	"encoding/json"
	"strings"

	"emperror.dev/errors"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func (c *WsController) authClient(ctx context.Context, cli *Client, raw json.RawMessage) error {
	request := struct {
		InitData string `json:"initData"`
	}{}

	if err := json.Unmarshal(raw, &request); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	var (
		parsedData *initdata.InitData
		err        error
	)

	if strings.Contains(request.InitData, "hash=mock_hash") {
		parsedData, err = usecase.ParseMockInitData(request.InitData)
		if err != nil {
			return errors.Wrap(err, "usecase.ParseMockInitData")
		}
	} else {
		if err = usecase.ValidateAuthTelegram(request.InitData); err != nil {
			return errors.Wrap(err, "usecase.ValidateAuthTelegram")
		}

		parsedData, err = usecase.ParseInitData(request.InitData)
		if err != nil {
			return errors.Wrap(err, "usecase.ParseInitData")
		}
	}

	user, err := c.svc.GetOrCreateUser(ctx, parsedData.User.ID, &parsedData.User.Username)
	if err != nil {
		return errors.Wrap(err, "usecase.GetOrCreateUser")
	}

	c.connections.Authorize(cli, user.TgID, user.IsOperator)

	rawUser, err := json.Marshal(user)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	if err = c.sendSuccessMessage(cli, OpAuthSuccess, rawUser); err != nil {
		return errors.Wrap(err, "c.sendSuccessMessage")
	}

	return nil
}
