import React from "react";
import {formatDateTime} from "@/utils/formatTime.ts";
import {truncate} from "@/utils/truncate.ts";
import styles from "./ChatListItem.module.css";
import type {ChatWithLastMessage} from "@/types";

interface Props {
  message: ChatWithLastMessage["last_message"];
}

export const ChatLastMessage: React.FC<Props> = ({message}) => {
  const isDeleted = !!message.deleted_at;
  return (
    <div className={styles.lastMessage}>
      <span className={`${styles.content} ${isDeleted ? styles.deleted : ""}`}>
        {isDeleted ? "Message deleted" : truncate(message.content, 60)}
      </span>
      <span className={styles.date}>
        {formatDateTime(message.created_at)}
      </span>
    </div>
  );
};