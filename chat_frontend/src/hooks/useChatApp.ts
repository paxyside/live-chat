import {useRef, useState} from "react";
import type {ChatMessage, ChatWithLastMessage, TypingMap} from "@/types";
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
  const [typing, setTyping] = useState<TypingMap>({});
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const {onOpenChat, onEditMessage, onReadMessage, onDeleteMessage, onSendMessage, onTyping} =
    useChatHandlers({
      setChatId,
      setMessages,
      setTyping,
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
    setTyping,
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
    onEditMessage,
    onDeleteMessage,
    typing,
    setTyping,
    onTyping,
    setChatId,
    setMessages,
  };
}
