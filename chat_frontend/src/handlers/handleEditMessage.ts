import React from "react";

interface EditMessageProps {
  chatId: number | null;
  messageId: number | null;
  content: string;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleEditMessage = ({chatId, messageId, content, wsRef}: EditMessageProps) => {
  if (wsRef.current?.readyState === WebSocket.OPEN && messageId != null) {
    wsRef.current.send(
      JSON.stringify({
        op: "message_edit",
        data: {
          chat_id: chatId,
          message_id: messageId,
          content: content
        },
      }),
    );
  }
};

export default handleEditMessage;
