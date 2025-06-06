import React from "react";

interface ReadMessageProps {
  chatId: number | null;
  messageId: number | null;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleReadMessage = ({chatId, messageId, wsRef}: ReadMessageProps) => {
  if (wsRef.current?.readyState === WebSocket.OPEN && messageId != null) {
    wsRef.current.send(
      JSON.stringify({
        op: "message_read",
        data: {
          chat_id: chatId,
          message_id: messageId
        },
      }),
    );
  }
};

export default handleReadMessage;
