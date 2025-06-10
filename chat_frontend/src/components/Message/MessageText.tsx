import React from "react";
import styles from "./Message.module.css";

interface MessageTextProps {
  content: string;
  deletedAt?: string | null;
}

const MessageText: React.FC<MessageTextProps> = ({content, deletedAt}) => (
  <>
    <span className={`${styles.messageText} ${deletedAt ? styles.deleted : ""}`}>
      {deletedAt ? "Message deleted" : content}
    </span>
  </>
);

export default MessageText;