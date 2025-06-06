import {useMemo} from "react";
import type {ChatWithLastMessage} from "@/types";

export function useSortedChats(
  chats: ChatWithLastMessage[],
  onlyWithMessages: boolean
) {
  return useMemo(() => {
    return chats
      .filter((chat) =>
        onlyWithMessages ? !!chat.last_message : true
      )
      .sort((a, b) => {
        const aTime = a.last_message?.created_at
          ? new Date(a.last_message.created_at).getTime()
          : 0;
        const bTime = b.last_message?.created_at
          ? new Date(b.last_message.created_at).getTime()
          : 0;
        return bTime - aTime;
      });
  }, [chats, onlyWithMessages]);
}