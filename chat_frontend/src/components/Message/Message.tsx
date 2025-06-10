import type {ChatMessage} from "@/types";
import React from "react";
import {useHoldToConfirm} from "./hooks/useHoldToConfirm.ts";
import MessageBubble from "@/components/Message/MessageBubble.tsx";
import MessageContent from "@/components/Message/MessageContent.tsx";
import MessageIcon from "@/components/Message/MessageIcon.tsx";
import styles from './Message.module.css';

interface Props {
  chatId: number | null;
  message: ChatMessage;
  isOperator: boolean;
  onDelete?: (chatId: number, id: number) => void;
  onEdit?: (chatId: number, messageId: number, content: string) => void;
  className?: string;
}

const Message: React.FC<Props> = ({
                                    chatId,
                                    message,
                                    isOperator,
                                    onDelete,
                                    onEdit,
                                    className,
                                  }) => {
  const canDelete =
    !message.deleted_at && isOperator === message.is_from_operator && onDelete;
  const canEdit = !message.deleted_at && isOperator === message.is_from_operator && onEdit;
  const {show, handleDown, handleUp, confirm, cancel} = useHoldToConfirm();

  const handleConfirmDelete = () => {
    confirm();
    onDelete?.(chatId!, message.id);
  };

  const handleConfirmEdit = (content: string) => {
    confirm();
    onEdit?.(chatId!, message.id, content);
  };

  return (
    <div
      onPointerDown={canDelete ? handleDown : canEdit ? handleDown : undefined}
      onPointerUp={canDelete ? handleUp : canEdit ? handleUp : undefined}
      onPointerLeave={canDelete ? handleUp : canEdit ? handleUp : undefined}
      className={`${styles.messageWrapper} ${message.is_from_operator ? styles.fromOperator : styles.fromUser} ${className || ""}`}
      onTouchStart={e => {
        handleDown();
        e.preventDefault();
      }}
      onTouchEnd={e => {
        handleUp();
        e.preventDefault();
      }}
      onTouchCancel={e => {
        handleUp();
        e.preventDefault();
      }}
    >
      <MessageBubble isOperator={message.is_from_operator}>
        <MessageIcon isOperator={message.is_from_operator}/>
        <MessageContent
          message={message}
          showConfirm={show}
          onConfirm={handleConfirmDelete}
          onEdit={content => handleConfirmEdit(content)}
          onCancel={cancel}
        />
      </MessageBubble>
    </div>
  );
};

export default React.memo(Message);
