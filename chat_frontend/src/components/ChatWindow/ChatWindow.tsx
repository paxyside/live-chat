import React, {useState} from "react";
import MessageList from "../MessageList/MessageList.tsx";
import MessageInput from "../MessageInput/MessageInput.tsx";
import type {ChatMessage} from "@/types";
import styles from "./ChatWindow.module.css";
import {AlignJustify} from "lucide-react";

interface ChatWindowProps {
  chatId: number | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isOperator: boolean;
  showListButton: boolean;
  onDeleteMessage?: (chatId: number, id: number) => void;
  onOpenChatList?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
                                                 chatId,
                                                 messages,
                                                 onSendMessage,
                                                 isOperator,
                                                 showListButton,
                                                 onDeleteMessage,
                                                 onOpenChatList,
                                               }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className={styles.window}>
      {showListButton && (
        <div className={styles.header}>
          <button
            className={styles.chatListButton}
            onClick={onOpenChatList}
            aria-label="Open chat list"
          >
            <AlignJustify size={24}/>
          </button>
        </div>
      )}
      <div className={styles.messageListWrapper}>
        <MessageList
          chatId={chatId}
          messages={messages}
          isOperator={isOperator}
          onDelete={onDeleteMessage}
        />
      </div>
      <MessageInput input={input} setInput={setInput} onSend={handleSend}/>
    </div>
  );
};

export default ChatWindow;