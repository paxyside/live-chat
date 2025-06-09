export interface WsMessage {
  op: string;
  data?: unknown;
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

export interface AuthPayload {
  user: User;
  chat_id: number;
  auth_date: number;
  hash: string;
}

export interface Chat {
  id: number;
  tg_id: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_tg_id: number;
  content: string;
  is_from_operator: boolean;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  read_by_user_at?: string;
  read_by_operator_at?: string;
}

export interface ChatWithLastMessage {
  chat: Chat;
  last_message: ChatMessage;
}

export type TypingMap = Record<number, { user: boolean; operator: boolean }>;