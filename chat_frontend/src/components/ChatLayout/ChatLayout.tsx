import React from "react";
import type {ChatMessage, ChatWithLastMessage, UploadedFile} from "@/types";
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
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement> | File) => Promise<UploadedFile | null>;
  handleSendMessage: (msg: string, file_url: string) => void;
  handleDeleteMessage: (chatId: number, id: number) => void;
  handleEditMessage: (chatId: number, messageId: number, content: string) => void;
  typingMessage?: Record<number, { user: boolean; operator: boolean }>;
  handleTyping?: () => void;
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
                                               handleFileInputChange,
                                               handleSendMessage,
                                               handleDeleteMessage,
                                               handleEditMessage,
                                               typingMessage,
                                               handleTyping
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
      onFileInputChange={handleFileInputChange}
      onSendMessage={handleSendMessage}
      onDeleteMessage={handleDeleteMessage}
      onEditMessage={handleEditMessage}
      typing={typingMessage}
      onTyping={handleTyping}
    />
  );
};

export default ChatLayout;