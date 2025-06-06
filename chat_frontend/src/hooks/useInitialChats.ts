import React, {useEffect} from "react";
import type {ChatMessage} from "@/types";

interface UseInitialChatProps {
  isOperator: boolean;
  connected: boolean;
  authenticated: boolean;
  setChatId: (id: number) => void;
  setMessages: (msgs: ChatMessage[]) => void;
  wsRef: React.RefObject<WebSocket | null>;
}

const useInitialChat = ({
                          isOperator,
                          connected,
                          authenticated,
                          setChatId,
                          setMessages,
                          wsRef,
                        }: UseInitialChatProps) => {
  useEffect(() => {
    if (isOperator && connected && authenticated) {
      const lastChatId = localStorage.getItem("operator_last_chat_id");
      if (lastChatId) {
        const id = Number(lastChatId);
        setChatId(id);
        setMessages([]);
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              op: "chat_open",
              data: {chat_id: id},
            }),
          );
        }
      }
    }
  }, [isOperator, connected, authenticated, setChatId, setMessages, wsRef]);
};

export default useInitialChat;
