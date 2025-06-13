import type {ChatMessage} from "@/types";
import React, {memo, useState} from "react";
import MessageMeta from "@/components/Message/MessageMeta.tsx";
import MessageDropDownMenu from "@/components/Message/MessageDropdownMenu.tsx";
import MessageEditInput from "@/components/Message/MessageEditInput.tsx";
import MessageText from "@/components/Message/MessageText.tsx";
import styles from './Message.module.css';
import MessageAttachment from "./MessageAttachment";
import {getFileNameByUrl} from "@/utils/getFileNameByUrl.ts";

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
      onCancel();
    };

    return (
      <div className={styles.messageContent}>
        {message.file_url && (
          <div className={styles.attachedFile}>
            <MessageAttachment file_url={message.file_url} filename={getFileNameByUrl(message.file_url)}/>
          </div>
        )}
        {isEditing ? (
          <MessageEditInput
            value={editText}
            onChange={setEditText}
            onSave={handleEditConfirm}
            onCancel={handleEditCancel}
          />
        ) : (
          <MessageText
            content={message.content}
            deletedAt={message.deleted_at}
          />
        )}
        <MessageMeta
          createdAt={message.created_at}
          readByOperatorAt={message.read_by_operator_at}
          readByUserAt={message.read_by_user_at}
          deletedAt={message.deleted_at}
          editedAt={message.edited_at}
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
