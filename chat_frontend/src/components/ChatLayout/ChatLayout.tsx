import React, {useState} from "react";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import AuthLayout from "./AuthLayout";
import OperatorLayout from "./OperatorLayout";
import UserLayout from "./UserLayout";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!connected || !authenticated) {
    return <AuthLayout error={error}/>;
  }

  return isOperator ? (
    <OperatorLayout
      error={error}
      chatId={chatId}
      chats={chats}
      messages={messages}
      sidebarOpen={sidebarOpen}
      onOpenSidebar={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onOpenChat={(id) => {
        handleOpenChat(id);
        setSidebarOpen(false);
      }}
      onSendMessage={handleSendMessage}
      onDeleteMessage={handleDeleteMessage}
    />
  ) : (
    <UserLayout
      chatId={chatId}
      error={error}
      messages={messages}
      onSendMessage={handleSendMessage}
      onDeleteMessage={handleDeleteMessage}
    />
  );
};

export default ChatLayout;