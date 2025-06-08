// ChatLayoutInner.tsx
import React from "react";
import styles from "./ChatLayout.module.css";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import {ErrorMessage} from "@/components/ErrorMessage";
import {ChatWindow} from "@/components/ChatWindow";

interface ChatLayoutInnerProps {
  isOperator: boolean;
  error: string | null;
  chatId: number | null;
  chats?: ChatWithLastMessage[];
  messages: ChatMessage[];
  onOpenChat?: (id: number) => void;
  onSendMessage: (msg: string) => void;
  onDeleteMessage: (chatId: number, id: number) => void;
}

const ChatLayoutInner: React.FC<ChatLayoutInnerProps> = ({
                                                           isOperator,
                                                           error,
                                                           chatId,
                                                           chats = [],
                                                           messages,
                                                           onOpenChat = () => {
                                                           },
                                                           onSendMessage,
                                                           onDeleteMessage,
                                                         }) => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <ErrorMessage error={error}/>
        <ChatWindow
          chatId={chatId}
          chats={chats}
          messages={messages}
          isOperator={isOperator}
          onOpenChat={onOpenChat}
          onSendMessage={onSendMessage}
          onDeleteMessage={onDeleteMessage}
        />
      </main>
    </div>
  );
};

export default ChatLayoutInner;