import React from "react";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import AuthLayout from "./AuthLayout";
import ChatLayoutInner from "./ChatLayoutInner";

interface ChatRootProps {
  connected: boolean;
  authenticated: boolean;
  isOperator: boolean;
  error: string | null;
  chatId: number | null;
  chats: ChatWithLastMessage[];
  messages: ChatMessage[];
  handleOpenChat: (id: number) => void;
  handleSendMessage: (msg: string) => void;
  handleDeleteMessage: (chatId: number, id: number) => void;
}

const ChatLayout: React.FC<ChatRootProps> = ({
                                               connected,
                                               authenticated,
                                               isOperator,
                                               error,
                                               chatId,
                                               chats,
                                               messages,
                                               handleOpenChat,
                                               handleSendMessage,
                                               handleDeleteMessage,
                                             }) => {
  if (!connected || !authenticated) {
    return <AuthLayout error={error}/>;
  }

  return (
    <ChatLayoutInner
      isOperator={isOperator}
      chatId={chatId}
      error={error}
      chats={isOperator ? chats : []}
      messages={messages}
      onOpenChat={isOperator ? handleOpenChat : undefined}
      onSendMessage={handleSendMessage}
      onDeleteMessage={handleDeleteMessage}
    />
  );
};

export default ChatLayout;