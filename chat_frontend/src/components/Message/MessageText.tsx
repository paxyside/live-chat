import React from "react";
import styles from "./Message.module.css";

interface MessageTextProps {
  content: string;
  deletedAt?: string | null;
  editedAt?: string | null;
}

const MessageText: React.FC<MessageTextProps> = ({content, deletedAt, editedAt}) => (
  <>
    <span className={`${styles.messageText} ${deletedAt ? styles.deleted : ""}`}>
      {deletedAt ? "Message deleted" : content}
    </span>
    {editedAt && <span className={styles.editedMark}>Edited</span>}
  </>
);

export default MessageText;