package domain

import (
	"time"

	"emperror.dev/errors"
)

var ErrChatNotFound = errors.New("chat not found")
var ErrMessageNotFound = errors.New("message not found")

type User struct {
	ID         int64     `json:"id"`
	TgID       int64     `json:"tg_id"`
	TgUsername *string   `json:"tg_username"`
	IsOperator bool      `json:"is_operator"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Chat struct {
	ID        int64     `json:"id"`
	TgID      int64     `json:"tg_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Message struct {
	ID               int64      `json:"id"`
	ChatID           int64      `json:"chat_id"`
	SenderTgID       int64      `json:"sender_tg_id"`
	Content          string     `json:"content"`
	IsFromOperator   bool       `json:"is_from_operator"`
	CreatedAt        time.Time  `json:"created_at"`
	DeletedAt        *time.Time `json:"deleted_at"`
	ReadByUserAt     *time.Time `json:"read_by_user_at"`
	ReadByOperatorAt *time.Time `json:"read_by_operator_at"`
}

type ChatWithLastMessage struct {
	Chat        Chat     `json:"chat"`
	LastMessage *Message `json:"last_message"`
}
