import React from "react";
import type {WsMessage} from "@/types";

interface SendMessageProps {
  text: string;
  chatId: number | null;
  isOperator: boolean;
  file_url: string;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleSendMessage = ({
                             text,
                             chatId,
                             isOperator,
                             file_url,
                             wsRef,
                           }: SendMessageProps) => {
  if ((!text || !text.trim()) && !file_url || !chatId) return;
  const message: WsMessage = {
    op: "message_send",
    data: {
      chat_id: chatId,
      content: text?.trim() || "",
      is_operator: isOperator,
      file_url: file_url || ""
    },
  };
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify(message));
  }
};

export default handleSendMessage;
