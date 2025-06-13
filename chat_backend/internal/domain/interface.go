package domain

import "context"

type Repository interface {
	GetOrCreateUser(ctx context.Context, tgID int64, tgUsername *string) (*User, error)
	SetOperator(ctx context.Context, tgID int64) error
	GetAllOperators(ctx context.Context) ([]User, error)
	CreateChat(ctx context.Context, tgID int64) (*Chat, error)
	ListAllChats(ctx context.Context) ([]ChatWithLastMessage, error)
	GetChatByTgID(ctx context.Context, tgID int64) (*Chat, error)
	GetChatByID(ctx context.Context, id int64) (*Chat, error)
	CreateMessage(
		ctx context.Context,
		chatID int64,
		senderTgID int64,
		content string,
		isFromOperator bool,
		fileURL string,
	) (*Message, error)
	GetMessagesByChatID(ctx context.Context, chatID int64) ([]Message, error)
	EditMessage(ctx context.Context, messageID int64, content string) (*Message, error)
	MarkMessageAsRead(ctx context.Context, messageID int64, isOperator bool) (*Message, error)
	MarkMessageAsDeleted(ctx context.Context, messageID int64) (*Message, error)
}

type Service interface {
	GetOrCreateUser(ctx context.Context, tgID int64, tgUsername *string) (*User, error)
	SetOperator(ctx context.Context, tgID int64) error
	GetAllOperators(ctx context.Context) ([]User, error)
	CreateChat(ctx context.Context, tgID int64) (*Chat, error)
	ListAllChats(ctx context.Context) ([]ChatWithLastMessage, error)
	GetChatByTgID(ctx context.Context, tgID int64) (*Chat, error)
	GetChatByID(ctx context.Context, id int64) (*Chat, error)
	CreateMessage(
		ctx context.Context,
		chatID int64,
		senderTgID int64,
		content string,
		isFromOperator bool,
		fileURL string,
	) (*Message, error)
	GetMessagesByChatID(ctx context.Context, chatID int64) ([]Message, error)
	EditMessage(ctx context.Context, messageID int64, content string) (*Message, error)
	MarkMessageAsRead(ctx context.Context, messageID int64, isOperator bool) (*Message, error)
	MarkMessageAsDeleted(ctx context.Context, messageID int64) (*Message, error)
}
