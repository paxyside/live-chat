// ChatLayoutInner.tsx
import React from "react";
import styles from "./ChatLayout.module.css";
import type {ChatMessage, ChatWithLastMessage, UploadedFile} from "@/types";
import {ErrorMessage} from "@/components/ErrorMessage";
import {ChatWindow} from "@/components/ChatWindow";

interface ChatLayoutInnerProps {
  isOperator: boolean;
  error: string | null;
  chatId: number | null;
  chats?: ChatWithLastMessage[];
  messages: ChatMessage[];
  onOpenChat?: (id: number) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement> | File) => Promise<UploadedFile | null>;
  onSendMessage: (msg: string, file_url: string) => void;
  onDeleteMessage: (chatId: number, id: number) => void;
  onEditMessage: (chatId: number, messageId: number, content: string) => void;
  typing?: Record<number, { user: boolean; operator: boolean }>;
  onTyping?: () => void;
}

const ChatLayoutInner: React.FC<ChatLayoutInnerProps> = ({
                                                           isOperator,
                                                           error,
                                                           chatId,
                                                           chats = [],
                                                           messages,
                                                           onOpenChat = () => {
                                                           },
                                                           onFileInputChange,
                                                           onSendMessage,
                                                           onDeleteMessage,
                                                           onEditMessage,
                                                           typing,
                                                           onTyping
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
          onFileInputChange={onFileInputChange}
          onSendMessage={onSendMessage}
          onDeleteMessage={onDeleteMessage}
          onEditMessage={onEditMessage}
          typing={typing}
          onTyping={onTyping}
        />
      </main>
    </div>
  );
};

export default ChatLayoutInner;