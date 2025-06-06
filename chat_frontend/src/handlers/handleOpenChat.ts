import type {ChatMessage} from "@/types";
import React from "react";

interface OpenChatProps {
  id: number | null;
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  wsRef: React.RefObject<WebSocket | null>;
}

const handleOpenChat = ({
                          id,
                          setChatId,
                          setMessages,
                          wsRef,
                        }: OpenChatProps) => {
  if (id == null) return;
  setChatId(id);
  setMessages([]);
  localStorage.setItem("operator_last_chat_id", String(id));
  wsRef.current?.send(
    JSON.stringify({op: "chat_open", data: {chat_id: id}}),
  );
};

export default handleOpenChat;
