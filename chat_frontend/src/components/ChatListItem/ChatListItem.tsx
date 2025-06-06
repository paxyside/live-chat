import React from "react";
import type {ChatWithLastMessage} from "@/types";
import {ChatTitle} from "./ChatTitle.tsx";
import {ChatLastMessage} from "./ChatLastMessage.tsx";
import styles from "./ChatListItem.module.css";

interface ChatListItemProps {
  chat: ChatWithLastMessage;
  onClick: (chatId: number) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = React.memo(({chat, onClick}) => {
  return (
    <li
      className={styles.item}
      onClick={() => onClick(chat.chat.id)}
      role="button"
      tabIndex={0}
    >
      <ChatTitle tgId={chat.chat.tg_id}/>
      {chat.last_message && <ChatLastMessage message={chat.last_message}/>}
    </li>
  );
});

export default ChatListItem;