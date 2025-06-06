import {useEffect, useRef} from "react";
import type {ChatMessage} from "@/types";

interface UseMessagesProps {
  chatId: number | null;
  messages: ChatMessage[];
  isOperator: boolean;
  onReadMessage: (chatId: number, messageId: number) => void;
}

const useMessages = ({
                       chatId,
                       messages,
                       isOperator,
                       onReadMessage,
                     }: UseMessagesProps): void => {
  const sentReadIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!chatId || messages.length === 0) return;

    messages.forEach((msg) => {
      const isFromOther = isOperator
        ? !msg.is_from_operator
        : msg.is_from_operator;
      const isUnread = isOperator
        ? !msg.read_by_operator_at
        : !msg.read_by_user_at;

      if (isFromOther && isUnread && !sentReadIds.current.has(msg.id)) {
        onReadMessage(chatId, msg.id);
        sentReadIds.current.add(msg.id);
      }
    });
  }, [chatId, messages, isOperator, onReadMessage]);
};

export default useMessages;
