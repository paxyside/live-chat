import React from "react";
import type {ChatWithLastMessage} from "@/types";
import {ChatListItem} from "@/components/ChatListItem";
import styles from "./ChatList.module.css";
import {useSortedChats} from "./hooks/useSortedChats.ts";

interface ChatListProps {
  chats: ChatWithLastMessage[];
  onOpenChat: (chatId: number) => void;
  onlyWithMessages?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
                                             chats,
                                             onOpenChat,
                                             onlyWithMessages = false,
                                           }) => {
  const sortedChats = useSortedChats(chats, onlyWithMessages);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {sortedChats.map((chat) => (
          <ChatListItem
            key={chat.chat.id}
            chat={chat}
            onClick={onOpenChat}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChatList;