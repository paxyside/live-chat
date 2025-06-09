import React from "react";
import {AlignJustify} from "lucide-react";
import styles from "./ChatWindow.module.css";

interface ChatWindowHeaderProps {
  onOpenSidebar: () => void;
}

const ChatWindowHeader: React.FC<ChatWindowHeaderProps> = ({onOpenSidebar}) => (
  <div className={styles.header}>
    <button
      className={styles.chatListButton}
      onClick={onOpenSidebar}
      aria-label="Open chat list"
    >
      <AlignJustify size={32}/>
    </button>
  </div>
);

export default ChatWindowHeader;