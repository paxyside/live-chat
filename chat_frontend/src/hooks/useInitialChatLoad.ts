import React, {useEffect} from "react";

interface Props {
  connected: boolean;
  authenticated: boolean;
  isOperator: boolean;
  wsRef: React.RefObject<WebSocket | null>;
}

const useInitialChatLoad = ({
                              connected,
                              authenticated,
                              isOperator,
                              wsRef,
                            }: Props) => {
  useEffect(() => {
    const ws = wsRef.current;
    if (connected && authenticated && ws && ws.readyState === WebSocket.OPEN) {
      const message = isOperator
        ? {op: "all_chats", data: {}}
        : {op: "chat_open", data: {}};
      ws.send(JSON.stringify(message));
    }
  }, [connected, authenticated, isOperator, wsRef]);
};

export default useInitialChatLoad;
