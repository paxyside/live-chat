import React, {useEffect, useRef} from "react";
import type {ChatMessage} from "@/types";
import {Message} from "@/components/MessageList/Message";
import styles from "./MessageList.module.css"; // импорт модуля


interface Props {
  chatId: number | null;
  messages: ChatMessage[];
  isOperator: boolean;
  onDelete?: (chatId: number, id: number) => void;
}

const MessageList: React.FC<Props> = ({chatId, messages, isOperator, onDelete}) => {
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
          className={styles.messageAppear}
        />
      ))}
    </div>
  );
};

export default MessageList;
