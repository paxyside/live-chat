package ws_server

import (
	"chat_backend/internal/domain"
	"context"
	"encoding/json"

	"emperror.dev/errors"
)

func (c *WsController) chatOpen(ctx context.Context, cli *Client, raw json.RawMessage) error {
	tgID, ok := cli.TelegramID()
	if !ok {
		return errors.New("not authorized")
	}

	isOperator, ok := cli.IsOperator()
	if !ok {
		return errors.New("not authorized")
	}

	var req struct {
		ChatID int64 `json:"chat_id"`
	}

	if err := json.Unmarshal(raw, &req); err != nil {
		return errors.Wrap(err, "json.Unmarshal")
	}

	var (
		chat *domain.Chat
		err  error
	)

	if isOperator {
		chat, err = c.svc.GetChatByID(ctx, req.ChatID)
		if err != nil {
			return errors.Wrap(err, "c.svc.GetChatByID")
		}
	} else {
		chat, err = c.svc.GetChatByTgID(ctx, tgID)
		if errors.Is(err, domain.ErrChatNotFound) {
			chat, err = c.svc.CreateChat(ctx, tgID)
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
	cli.SetActiveChat(chat.ID)

	return c.sendSuccessMessage(cli, OpChatOpenSuccess, rawResp)
}
