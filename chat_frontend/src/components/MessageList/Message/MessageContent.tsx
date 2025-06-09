import type {ChatMessage} from "@/types";
import React, {memo, useState} from "react";
import MessageMeta from "@/components/MessageList/Message/MessageMeta.tsx";
import MessageDropDownMenu from "@/components/MessageList/Message/MessageDropdownMenu.tsx";
import styles from './Message.module.css';

interface MessageContentProps {
  message: ChatMessage;
  showConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit: (content: string) => void;
}

const MessageContent: React.FC<MessageContentProps> = memo(
  ({message, showConfirm, onConfirm, onEdit, onCancel}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.content);

    const handleEdit = () => {
      setIsEditing(true);
      setEditText(message.content);
    };

    const handleEditConfirm = () => {
      setIsEditing(false);
      onEdit(editText);
      onCancel();
    };

    const handleEditCancel = () => {
      setIsEditing(false);
      setEditText(message.content);
    };

    return (
      <div className={styles.messageContent}>
        {isEditing ? (
          <div className={styles.editContainer}>
            <input
              className={styles.editInput}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleEditConfirm();
                if (e.key === "Escape") handleEditCancel();
              }}
              autoFocus
            />
            <button className={styles.editSaveBtn} onClick={handleEditConfirm}>Сохранить</button>
            <button className={styles.editCancelBtn} onClick={handleEditCancel}>Отмена</button>
          </div>
        ) : (
          <>
            <span className={`${styles.messageText} ${message.deleted_at ? styles.deleted : ""}`}>
              {message.deleted_at ? "Message deleted" : message.content}
            </span>
            {message.edited_at && <span className={styles.editedMark}>Edited</span>}
          </>
        )}
        <MessageMeta
          createdAt={message.created_at}
          readByOperatorAt={message.read_by_operator_at}
          readByUserAt={message.read_by_user_at}
          deletedAt={message.deleted_at}
        />
        {showConfirm && (
          <MessageDropDownMenu
            onConfirmEdit={handleEdit}
            onConfirmDelete={onConfirm}
            onCancel={onCancel}
          />
        )}
      </div>
    );
  },
);

export default MessageContent;
