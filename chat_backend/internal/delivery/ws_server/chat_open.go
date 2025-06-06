package ws_server

import (
	"chat_backend/internal/domain"
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) chatOpen(ctx context.Context, cli *Client, raw json.RawMessage) error {
	if cli.Meta.TelegramID == nil {
		return errors.New("not authorized")
	}

	var req struct {
		ChatID int64 `json:"chat_id"`
	}
	if err := json.Unmarshal(raw, &req); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	if cli.Meta.IsOperator == nil {
		user, err := c.svc.GetOrCreateUser(ctx, *cli.Meta.TelegramID, nil)
		if err != nil {
			return errors.Wrap(err, "c.svc.GetOrCreateUser")
		}
		cli.Meta.IsOperator = &user.IsOperator
	}

	var (
		chat *domain.Chat
		err  error
	)

	if *cli.Meta.IsOperator {
		chat, err = c.svc.GetChatByID(ctx, req.ChatID)
		if err != nil {
			return errors.Wrap(err, "c.svc.GetChatByID")
		}
		if chat == nil {
			return errors.New("chat not found")
		}
	} else {
		chat, err = c.svc.GetChatByTgID(ctx, *cli.Meta.TelegramID)
		if errors.Is(err, domain.ErrChatNotFound) {
			chat, err = c.svc.CreateChat(ctx, *cli.Meta.TelegramID)
			if err != nil {
				return errors.Wrap(err, "c.svc.CreateChat")
			}
		} else if err != nil {
			return errors.Wrap(err, "c.svc.GetChatByTgID")
		}
	}

	messages, err := c.svc.GetMessagesByChatID(ctx, chat.ID)
	if err != nil {
		return errors.Wrap(err, "c.svc.GetMessagesByChatID")
	}

	resp := struct {
		Chat     *domain.Chat     `json:"chat"`
		Messages []domain.Message `json:"messages"`
	}{
		Chat:     chat,
		Messages: messages,
	}

	rawResp, err := json.Marshal(resp)
	if err != nil {
		return errors.Wrap(err, "json.Marshal")
	}

	c.connections.JoinChat(cli, chat.ID)

	return c.sendSuccessMessage(cli, OpChatOpenSuccess, rawResp)
}
