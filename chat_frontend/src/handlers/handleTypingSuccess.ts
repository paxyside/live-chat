import React from "react";
import type {TypingMap} from "@/types";


export function handleTypingSuccess(
  data: { is_operator: boolean; chat_id?: number },
  setTyping: React.Dispatch<React.SetStateAction<TypingMap>>
) {
  const chatId = data.chat_id ?? -1;
  if (chatId === -1) return;
  const role = data.is_operator ? 'operator' : 'user';

  setTyping((prev) => {
    const prevChat = prev[chatId] || {user: false, operator: false};
    return {
      ...prev,
      [chatId]: {
        ...prevChat,
        [role]: true,
      },
    };
  });

  setTypingTimeout(chatId, role, setTyping);
}

function setTypingTimeout(
  chatId: number,
  role: 'user' | 'operator',
  setTyping: React.Dispatch<React.SetStateAction<TypingMap>>
) {
  const w = window as Window & {
    typingTimeouts?: {
      [chatId: number]: Partial<Record<'user' | 'operator', ReturnType<typeof setTimeout>>>;
    };
  };
  if (!w.typingTimeouts) w.typingTimeouts = {};
  if (w.typingTimeouts[chatId]?.[role]) clearTimeout(w.typingTimeouts[chatId][role]);
  if (!w.typingTimeouts[chatId]) w.typingTimeouts[chatId] = {};
  w.typingTimeouts[chatId][role] = setTimeout(() => {
    setTyping((prev) => {
      const prevChat = prev[chatId] || {user: false, operator: false};
      return {
        ...prev,
        [chatId]: {
          ...prevChat,
          [role]: false,
        },
      };
    });
  }, 3000);
}