import {useRef, useState} from "react";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import useMessages from "./useMessages";
import useInitialChat from "./useInitialChats";
import useInitialChatLoad from "./useInitialChatLoad";
import useWebSocketConnection from "./useWebSocket";
import useChatHandlers from "./useChatHandlers";

export default function useChatApp(wsUrl: string) {
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isOperator, setIsOperator] = useState(false);
  const [chats, setChats] = useState<ChatWithLastMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const {onOpenChat, onReadMessage, onDeleteMessage, onSendMessage} =
    useChatHandlers({
      setChatId,
      setMessages,
      wsRef,
      chatId,
      isOperator,
    });

  useWebSocketConnection({
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
  });

  useInitialChatLoad({
    connected,
    authenticated,
    isOperator,
    wsRef,
  });

  useMessages({
    chatId,
    messages,
    isOperator,
    onReadMessage,
  });

  useInitialChat({
    isOperator,
    connected,
    authenticated,
    setChatId,
    setMessages,
    wsRef,
  });

  return {
    connected,
    authenticated,
    isOperator,
    error,
    chatId,
    chats,
    messages,
    onOpenChat,
    onSendMessage,
    onDeleteMessage,
    setChatId,
    setMessages,
  };
}
