package service

import (
	"chat_backend/internal/domain"
	"context"
)

type Service struct {
	repo domain.Repository
}

func NewService(repo domain.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetOrCreateUser(ctx context.Context, tgID int64, tgUsername *string) (*domain.User, error) {
	return s.repo.GetOrCreateUser(ctx, tgID, tgUsername)
}

func (s *Service) SetOperator(ctx context.Context, tgID int64) error {
	return s.repo.SetOperator(ctx, tgID)
}

func (s *Service) CreateChat(ctx context.Context, tgID int64) (*domain.Chat, error) {
	return s.repo.CreateChat(ctx, tgID)
}

func (s *Service) ListAllChats(ctx context.Context) ([]domain.ChatWithLastMessage, error) {
	return s.repo.ListAllChats(ctx)
}

func (s *Service) GetChatByTgID(ctx context.Context, tgID int64) (*domain.Chat, error) {
	return s.repo.GetChatByTgID(ctx, tgID)
}

func (s *Service) GetChatByID(ctx context.Context, id int64) (*domain.Chat, error) {
	return s.repo.GetChatByID(ctx, id)
}

func (s *Service) CreateMessage(
	ctx context.Context, chatID int64, senderTgID int64, content string, isFromOperator bool,
) (*domain.Message, error) {
	return s.repo.CreateMessage(ctx, chatID, senderTgID, content, isFromOperator)
}

func (s *Service) GetMessagesByChatID(ctx context.Context, chatID int64) ([]domain.Message, error) {
	return s.repo.GetMessagesByChatID(ctx, chatID)
}

func (s *Service) MarkMessageAsRead(ctx context.Context, messageID int64, isOperator bool) (*domain.Message, error) {
	return s.repo.MarkMessageAsRead(ctx, messageID, isOperator)
}

func (s *Service) MarkMessageAsDeleted(ctx context.Context, messageID int64) (*domain.Message, error) {
	return s.repo.MarkMessageAsDeleted(ctx, messageID)
}
