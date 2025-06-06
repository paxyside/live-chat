import React from "react";
import type {WsMessage} from "@/types";

interface SendMessageProps {
  text: string;
  chatId: number | null;
  isOperator: boolean;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleSendMessage = ({
                             text,
                             chatId,
                             isOperator,
                             wsRef,
                           }: SendMessageProps) => {
  if (!text.trim() || !chatId) return;
  const message: WsMessage = {
    op: "message_send",
    data: {
      chat_id: chatId,
      content: text.trim(),
      is_operator: isOperator,
    },
  };
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify(message));
  }
};

export default handleSendMessage;
