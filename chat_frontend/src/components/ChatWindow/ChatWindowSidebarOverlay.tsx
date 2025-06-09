import React from "react";
import styles from "./ChatWindow.module.css";

interface ChatWindowSidebarOverlayProps {
  onClose: () => void;
  sidebarOpen: boolean;
}

const ChatWindowSidebarOverlay: React.FC<ChatWindowSidebarOverlayProps> = ({onClose, sidebarOpen}) => (
  sidebarOpen ? (
    <button
      type="button"
      className={styles.overlay}
      onClick={onClose}
      aria-label="Close sidebar"
    />
  ) : null
);

export default ChatWindowSidebarOverlay;