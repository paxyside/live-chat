import React from "react";
import {PanelLeftClose} from "lucide-react";
import {ChatList} from "@/components/ChatList";
import styles from "./ChatWindow.module.css";
import type {ChatWithLastMessage} from "@/types";

interface ChatWindowSidebarProps {
  chats: ChatWithLastMessage[];
  onOpenChat: (id: number) => void;
  onClose: () => void;
  sidebarOpen: boolean;
}

const ChatWindowSidebar: React.FC<ChatWindowSidebarProps> = ({chats, onOpenChat, onClose, sidebarOpen}) => (
  <aside className={styles.sidebar} data-open={sidebarOpen}>
    <button
      className={styles.sidebarBackButton}
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <PanelLeftClose size={32}/>
    </button>
    <ChatList chats={chats} onOpenChat={(id) => {
      onOpenChat(id);
      onClose();
    }}/>
  </aside>
);

export default ChatWindowSidebar;