package repository

import (
	"chat_backend/internal/domain"
	"chat_backend/internal/domain/infrastructure/postgres"
	"context"
	"time"

	"emperror.dev/errors"
	"github.com/jackc/pgx/v5"
)

type Repo struct {
	db postgres.DBExecutor
}

func NewRepo(db postgres.DBExecutor) *Repo {
	return &Repo{db: db}
}

// --- USERS ---

func (r *Repo) GetOrCreateUser(ctx context.Context, tgID int64, tgUsername *string) (*domain.User, error) {
	tx, err := r.db.BeginTx(ctx)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.BeginTx")
	}

	defer func() {
		if err != nil {
			_ = tx.Rollback(ctx)
		} else {
			_ = tx.Commit(ctx)
		}
	}()

	selectQuery := `SELECT * FROM users WHERE tg_id = $1 FOR UPDATE`

	row, err := tx.Query(ctx, selectQuery, tgID)
	if err != nil {
		return nil, errors.Wrap(err, "tx.Query")
	}

	user, err := pgx.CollectOneRow[domain.User](row, pgx.RowToStructByName[domain.User])
	switch {
	case errors.Is(err, pgx.ErrNoRows):
		insertQuery := `
			INSERT INTO users (tg_id, tg_username)
			VALUES ($1, $2)
			RETURNING *
		`

		row, err = tx.Query(ctx, insertQuery, tgID, tgUsername)
		if err != nil {
			return nil, errors.Wrap(err, "tx.Query")
		}

		user, err = pgx.CollectOneRow[domain.User](row, pgx.RowToStructByName[domain.User])
		if err != nil {
			return nil, errors.Wrap(err, "pgx.ErrNoRows: pgx.CollectOneRow")
		}

		return &user, nil
	case err != nil:
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	default:
		return &user, nil
	}
}

func (r *Repo) SetOperator(ctx context.Context, tgID int64) error {
	query := `UPDATE users SET is_operator = $1, updated_at = $2 WHERE tg_id = $3`

	cmd, err := r.db.Exec(ctx, query, true, time.Now(), tgID)
	if err != nil {
		return errors.Wrap(err, "r.db.Exec")
	}

	if cmd.RowsAffected() == 0 {
		return errors.Errorf("no user found with chat_id=%d", tgID)
	}

	deleteChatQuery := `DELETE FROM chats WHERE tg_id = $1`
	cmd, err = r.db.Exec(ctx, deleteChatQuery, tgID)
	if err != nil {
		return errors.Wrap(err, "r.db.Exec")
	}

	return nil
}

// --- CHATS ---

func (r *Repo) CreateChat(ctx context.Context, tgID int64) (*domain.Chat, error) {
	query := `
		INSERT INTO chats (tg_id)
		VALUES ($1)
		RETURNING id, tg_id, created_at
	`

	row, err := r.db.Query(ctx, query, tgID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	chat, err := pgx.CollectOneRow[domain.Chat](row, pgx.RowToStructByName[domain.Chat])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &chat, nil
}

func (r *Repo) ListAllChats(ctx context.Context) ([]domain.ChatWithLastMessage, error) {
	query := `
		SELECT
		  row_to_json(c.*) AS chat,
		  CASE WHEN m.id IS NOT NULL THEN row_to_json(m.*) ELSE NULL END AS last_message
		FROM chats c
		LEFT JOIN LATERAL (
		  SELECT *
		  FROM messages
		  WHERE messages.chat_id = c.id
		  ORDER BY messages.created_at DESC
		  LIMIT 1
		) m ON true
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	chats, err := pgx.CollectRows[domain.ChatWithLastMessage](rows, pgx.RowToStructByName[domain.ChatWithLastMessage])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectRows")
	}

	return chats, nil
}

func (r *Repo) GetChatByTgID(ctx context.Context, tgID int64) (*domain.Chat, error) {
	query := `SELECT * FROM chats WHERE tg_id = $1`

	row, err := r.db.Query(ctx, query, tgID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	chat, err := pgx.CollectOneRow[domain.Chat](row, pgx.RowToStructByName[domain.Chat])

	switch {
	case errors.Is(err, pgx.ErrNoRows):
		return nil, domain.ErrChatNotFound
	case err != nil:
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &chat, nil
}

func (r *Repo) GetChatByID(ctx context.Context, id int64) (*domain.Chat, error) {
	query := `SELECT * FROM chats WHERE id = $1`

	row, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	chat, err := pgx.CollectOneRow[domain.Chat](row, pgx.RowToStructByName[domain.Chat])
	switch {
	case errors.Is(err, pgx.ErrNoRows):
		return nil, domain.ErrChatNotFound
	case err != nil:
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &chat, nil
}

// --- MESSAGES ---

func (r *Repo) CreateMessage(
	ctx context.Context, chatID int64, senderTgID int64, content string, isFromOperator bool, fileURL string,
) (*domain.Message, error) {
	query := `
		INSERT INTO messages (chat_id, sender_tg_id, content, is_from_operator, file_url, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *
	`

	row, err := r.db.Query(ctx, query, chatID, senderTgID, content, isFromOperator, fileURL, time.Now())
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	msg, err := pgx.CollectOneRow[domain.Message](row, pgx.RowToStructByName[domain.Message])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &msg, nil
}

func (r *Repo) GetMessagesByChatID(ctx context.Context, chatID int64) ([]domain.Message, error) {
	query := `SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC`

	rows, err := r.db.Query(ctx, query, chatID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	messages, err := pgx.CollectRows[domain.Message](rows, pgx.RowToStructByName[domain.Message])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectRows")
	}

	return messages, nil
}

func (r *Repo) EditMessage(ctx context.Context, messageID int64, content string) (*domain.Message, error) {
	query := `UPDATE messages SET content = $1, edited_at = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *`

	row, err := r.db.Query(ctx, query, content, time.Now(), messageID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	msg, err := pgx.CollectOneRow[domain.Message](row, pgx.RowToStructByName[domain.Message])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &msg, nil
}

func (r *Repo) MarkMessageAsRead(ctx context.Context, messageID int64, isOperator bool) (*domain.Message, error) {
	var query string

	if isOperator {
		query = `UPDATE messages SET read_by_operator_at = $1 WHERE id = $2 AND read_by_operator_at IS NULL RETURNING *`
	} else {
		query = `UPDATE messages SET read_by_user_at = $1 WHERE id = $2 AND read_by_user_at IS NULL RETURNING *`
	}

	row, err := r.db.Query(ctx, query, time.Now(), messageID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	msg, err := pgx.CollectOneRow[domain.Message](row, pgx.RowToStructByName[domain.Message])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &msg, nil
}

func (r *Repo) MarkMessageAsDeleted(ctx context.Context, messageID int64) (*domain.Message, error) {
	query := `UPDATE messages SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`

	row, err := r.db.Query(ctx, query, time.Now(), messageID)
	if err != nil {
		return nil, errors.Wrap(err, "r.db.Query")
	}

	msg, err := pgx.CollectOneRow[domain.Message](row, pgx.RowToStructByName[domain.Message])
	if err != nil {
		return nil, errors.Wrap(err, "pgx.CollectOneRow")
	}

	return &msg, nil
}
