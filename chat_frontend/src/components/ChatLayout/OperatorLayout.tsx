import React from "react";
import styles from "./ChatLayout.module.css";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import {ChatList} from "@/components/ChatList";
import {ErrorMessage} from "@/components/ErrorMessage";
import {ChatWindow} from "@/components/ChatWindow";
import {PanelLeftClose} from "lucide-react";

interface OperatorLayoutProps {
  error: string | null;
  chatId: number | null;
  chats: ChatWithLastMessage[];
  messages: ChatMessage[];
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onOpenChat: (id: number) => void;
  onSendMessage: (msg: string) => void;
  onDeleteMessage: (chatId: number, id: number) => void;
}

const OperatorLayout: React.FC<OperatorLayoutProps> = ({
  error,
  chatId,
  chats,
  messages,
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  onOpenChat,
  onSendMessage,
  onDeleteMessage,
}) => {
  const isSidebarOpen = chatId === null ? true : sidebarOpen;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} data-open={isSidebarOpen}>
        <button
          type="button"
          className={styles.sidebarBackButton}
          onClick={onCloseSidebar}
          aria-label="Close sidebar"
        >
          <PanelLeftClose size={24}/>
        </button>
        <ChatList chats={chats} onOpenChat={onOpenChat}/>
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={onCloseSidebar}
          aria-label="Close sidebar"
        />
      )}

      {chatId === null ? null : (
        <main className={styles.main}>
          <ErrorMessage error={error}/>
          <ChatWindow
            chatId={chatId}
            messages={messages}
            onSendMessage={onSendMessage}
            isOperator={true}
            onOpenChatList={onOpenSidebar}
            showListButton={!isSidebarOpen}
            onDeleteMessage={onDeleteMessage}
          />
        </main>
      )}
    </div>
  );
};

export default OperatorLayout;