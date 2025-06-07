import type {ChatMessage, ChatWithLastMessage, WsMessage,} from "@/types";
import {formatOpCode} from "@/utils/formatOpCode";

interface Handlers {
  chatId: number | null;
  isOperator: boolean;
  setAuthenticated: (v: boolean) => void;
  setIsOperator: (v: boolean) => void;
  setChats: (v: ChatWithLastMessage[]) => void;
  setMessages: (
    v: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => void;
  setChatId: (v: number | null) => void;
  setError: (v: string) => void;
  onReadMessage: (chatId: number, id: number) => void;
}

export const handleWebSocketMessage = (
  event: MessageEvent,
  handlers: Handlers
) => {
  const {
    setAuthenticated,
    setIsOperator,
    setChats,
    setMessages,
    setChatId,
    setError,
  } = handlers;

  if (!event.data) return;

  try {
    const msg: WsMessage = JSON.parse(event.data);

    switch (msg.op) {
      case "auth_success": {
        const data = msg.data as { is_operator: boolean } | undefined;

        setAuthenticated(true);
        setIsOperator(data?.is_operator ?? false);
        setError("");

        break;
      }
      case "all_chats_success": {
        const data = Array.isArray(msg.data)
          ? (msg.data as ChatWithLastMessage[])
          : [];

        setChats(data);
        setError("");

        break;
      }
      case "chat_open_success": {
        const data = msg.data as
          | { chat: { id: number }; messages: ChatMessage[] }
          | undefined;

        setChatId(data?.chat?.id ?? null);
        setMessages(Array.isArray(data?.messages) ? data!.messages : []);
        setError("");

        break;
      }
      case "message_new": {
        const newMsg = msg.data as ChatMessage;

        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        break;
      }
      case "message_read_success": {
        const data = msg.data as ChatMessage;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.id
              ? {...m, read_by_user_at: data.read_by_user_at, read_by_operator_at: data.read_by_operator_at}
              : m
          )
        );

        break;
      }
      case "message_delete_success": {
        const data = msg.data as { id: number; deleted_at: string };

        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.id ? {...m, deleted_at: data.deleted_at} : m
          )
        );

        break;
      }
      default: {
        setError(`[ ERROR: ${formatOpCode(msg.op)}, ${JSON.stringify(msg.data)} ]`);
        break;
      }
    }
  } catch {
    setError("[ ERROR PARSING MESSAGE ]");
  }
};