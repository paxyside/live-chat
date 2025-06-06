BEGIN;

CREATE TABLE users
(
    id          SERIAL PRIMARY KEY,
    tg_id       BIGINT UNIQUE NOT NULL,
    tg_username VARCHAR(64)   NULL,
    is_operator BOOL                   DEFAULT FALSE,
    created_at  timestamptz   NOT NULL DEFAULT now(),
    updated_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE chats
(
    id         SERIAL PRIMARY KEY,
    tg_id      INTEGER     NOT NULL REFERENCES users (tg_id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages
(
    id                  SERIAL PRIMARY KEY,
    chat_id             INTEGER     NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
    sender_tg_id        INTEGER     NOT NULL REFERENCES users (tg_id) ON DELETE CASCADE,
    content             TEXT,
    is_from_operator    BOOLEAN     NOT NULL,
    created_at          timestamptz NOT NULL DEFAULT now(),
    deleted_at          timestamptz NULL,
    read_by_user_at     timestamptz NULL,
    read_by_operator_at timestamptz NULL
);

CREATE INDEX idx_chats_created_at ON chats(created_at);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_chat_id_created_at ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_read_by_user_at ON messages(read_by_user_at);
CREATE INDEX idx_messages_read_by_operator_at ON messages(read_by_operator_at);
CREATE INDEX idx_messages_deleted_at ON messages(deleted_at);
CREATE INDEX idx_messages_is_from_operator ON messages(is_from_operator);

COMMIT;
