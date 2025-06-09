import React, {useEffect} from "react";
import {getInitData} from "../utils/getInitData";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import {handleWebSocketMessage} from "@/handlers/handleWebSocketMessage.ts";
import type {TypingMap} from "./useChatApp";


interface Props {
  wsUrl: string;
  chatId: number | null;
  isOperator: boolean;
  setConnected: (v: boolean) => void;
  setAuthenticated: (v: boolean) => void;
  setIsOperator: (v: boolean) => void;
  setChats: (v: ChatWithLastMessage[]) => void;
  setMessages: (
    v: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => void;
  setChatId: (v: number | null) => void;
  setError: (v: string) => void;
  wsRef: React.RefObject<WebSocket | null>;
  onReadMessage: (chatId: number, id: number) => void;
  setTyping: React.Dispatch<React.SetStateAction<TypingMap>>;
}

const useWebSocketConnection = ({
                                  wsUrl,
                                  chatId,
                                  isOperator,
                                  setConnected,
                                  setAuthenticated,
                                  setIsOperator,
                                  setChats,
                                  setMessages,
                                  setChatId,
                                  setError,
                                  wsRef,
                                  onReadMessage,
                                  setTyping
                                }: Props) => {
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError("");
        const initData = getInitData();
        ws.send(JSON.stringify({op: "auth", data: {initData}}));
      };

      ws.onmessage = (event) =>
        handleWebSocketMessage(event, {
          chatId,
          isOperator,
          setAuthenticated,
          setIsOperator,
          setChats,
          setMessages,
          setChatId,
          setError,
          onReadMessage,
          setTyping,
        });

      ws.onerror = () => setError("[ INTERNAL ERROR ]");

      ws.onclose = () => {
        setConnected(false);
        setAuthenticated(false);
        setError("[ RECONNECTING... ]");
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    const initialTimeout = setTimeout(connect, 100);

    return () => {
      clearTimeout(reconnectTimeout);
      clearTimeout(initialTimeout);
      ws?.close();
    };
  }, [wsUrl, chatId, isOperator, onReadMessage, setAuthenticated, setChatId, setChats, setConnected, setError, setIsOperator, setMessages, wsRef, setTyping]);
};

export default useWebSocketConnection;