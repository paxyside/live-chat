import React from "react";

interface TypingMessageProps {
  chatId: number | null;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleTypingMessage = ({chatId, wsRef}: TypingMessageProps) => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    const payload = {
      op: "message_typing",
      data: {
        chat_id: chatId,
      },
    };
    wsRef.current.send(
      JSON.stringify(payload),
    );
  } else {
    console.warn("[Typing] WebSocket not open", wsRef.current?.readyState);
  }
};

export default handleTypingMessage;
