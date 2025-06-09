import React, {useCallback} from "react";
import handleOpenChat from "../handlers/handleOpenChat";
import handleReadMessage from "../handlers/handleReadMessage";
import handleDeleteMessage from "../handlers/handleDeleteMessage";
import handleSendMessage from "../handlers/handleSendMessage";
import type {ChatMessage, TypingMap} from "@/types";
import handleEditMessage from "@/handlers/handleEditMessage.ts";
import handleTypingMessage from "@/handlers/handleTypingMessage.ts";

interface UseChatHandlersProps {
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setTyping: React.Dispatch<React.SetStateAction<TypingMap>>;
  wsRef: React.RefObject<WebSocket | null>;
  chatId: number | null;
  isOperator: boolean;
}

export default function useChatHandlers({
                                          setChatId,
                                          setMessages,
                                          wsRef,
                                          chatId,
                                          isOperator,
                                        }: UseChatHandlersProps) {
  const onOpenChat = useCallback(
    (id: number) => {
      handleOpenChat({id, setChatId, setMessages, wsRef});
    },
    [setChatId, setMessages, wsRef],
  );

  const onEditMessage = useCallback(
    (chatId: number, messageId: number, content: string) => {
      handleEditMessage({chatId, messageId, content, wsRef});
    },
    [wsRef],
  );

  const onReadMessage = useCallback(
    (chatId: number, messageId: number) => {
      handleReadMessage({chatId, messageId, wsRef});
    },
    [wsRef],
  );

  const onDeleteMessage = useCallback(
    (chatId: number, messageId: number) => {
      handleDeleteMessage({chatId, messageId, wsRef});
    },
    [wsRef],
  );

  const onSendMessage = useCallback(
    (text: string) => {
      handleSendMessage({text, chatId, isOperator, wsRef});
    },
    [chatId, isOperator, wsRef],
  );

  const onTyping = useCallback(() => {
    handleTypingMessage({chatId, wsRef});
  }, [chatId, wsRef]);

  return {onOpenChat, onEditMessage, onReadMessage, onDeleteMessage, onSendMessage, onTyping};
}
