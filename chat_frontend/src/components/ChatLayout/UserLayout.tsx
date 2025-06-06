import React from "react";
import type {ChatMessage} from "@/types";
import {ErrorMessage} from "@/components/ErrorMessage";
import {ChatWindow} from "@/components/ChatWindow";
import styles from "./ChatLayout.module.css";

interface UserLayoutProps {
  chatId: number | null;
  error: string | null;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  onDeleteMessage: (chatId: number, id: number) => void;
}

const UserLayout: React.FC<UserLayoutProps> = ({
                                                 chatId,
                                                 error,
                                                 messages,
                                                 onSendMessage,
                                                 onDeleteMessage,
                                               }) => (
  <div className={styles.layout}>
    <main className={styles.main}>
      <ErrorMessage error={error}/>
      <ChatWindow
        chatId={chatId}
        messages={messages}
        onSendMessage={onSendMessage}
        isOperator={false}
        showListButton={false}
        onDeleteMessage={onDeleteMessage}
      />
    </main>
  </div>
);

export default UserLayout;