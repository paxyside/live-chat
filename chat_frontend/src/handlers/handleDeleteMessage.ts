import React from "react";

interface DeleteMessageProps {
  chatId: number | null;
  messageId: number;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleDeleteMessage = ({chatId, messageId, wsRef}: DeleteMessageProps) => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        op: "message_delete",
        data: {
          chat_id: chatId,
          message_id: messageId
        },
      }),
    );
  }
};

export default handleDeleteMessage;
