import type {ChatMessage} from "@/types";
import React, {memo} from "react";
import MessageMeta from "@/components/MessageList/Message/MessageMeta.tsx";
import MessageDeletePopup from "@/components/MessageList/Message/MessageDeletePopup.tsx";
import styles from './Message.module.css';


interface MessageContentProps {
  message: ChatMessage;
  showConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const MessageContent: React.FC<MessageContentProps> = memo(
  ({message, showConfirm, onConfirm, onCancel}) => (
    <div className={styles.messageContent}>
      <span className={`${styles.messageText} ${message.deleted_at ? styles.deleted : ""}`}>
        {message.deleted_at ? "Message deleted" : message.content}
      </span>
      <MessageMeta
        createdAt={message.created_at}
        readByOperatorAt={message.read_by_operator_at}
        readByUserAt={message.read_by_user_at}
        deletedAt={message.deleted_at}
      />
      {showConfirm && <MessageDeletePopup onConfirm={onConfirm} onCancel={onCancel}/>}
    </div>
  ),
);

export default MessageContent;
