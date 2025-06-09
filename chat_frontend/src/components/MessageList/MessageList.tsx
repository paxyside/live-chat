import React, {useEffect, useRef} from "react";
import type {ChatMessage} from "@/types";
import {Message} from "@/components/MessageList/Message";
import styles from "./MessageList.module.css"; // импорт модуля


interface Props {
  chatId: number | null;
  messages: ChatMessage[];
  isOperator: boolean;
  onDelete?: (chatId: number, id: number) => void;
  onEdit?: (chatId: number, messageId: number, content: string) => void;
}

const MessageList: React.FC<Props> = ({chatId, messages, isOperator, onDelete, onEdit}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.container} ref={containerRef}>
      {messages.map((msg) => (
        <Message
          chatId={chatId}
          key={msg.id}
          message={msg}
          isOperator={isOperator}
          onDelete={onDelete}
          onEdit={onEdit}
          className={styles.messageAppear}
        />
      ))}
    </div>
  );
};

export default MessageList;
