import React, {useState} from "react";
import MessageList from "../MessageList/MessageList.tsx";
import MessageInput from "../MessageInput/MessageInput.tsx";
import {ChatList} from "@/components/ChatList";
import {AlignJustify, PanelLeftClose} from "lucide-react";
import type {ChatMessage, ChatWithLastMessage} from "@/types";
import styles from "./ChatWindow.module.css";

interface ChatWindowProps {
  chatId: number | null;
  messages: ChatMessage[];
  chats: ChatWithLastMessage[] | [];
  onSendMessage: (message: string) => void;
  isOperator: boolean;
  onOpenChat: (id: number) => void;
  onDeleteMessage?: (chatId: number, id: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
                                                 chatId,
                                                 messages,
                                                 chats,
                                                 onSendMessage,
                                                 isOperator,
                                                 onOpenChat,
                                                 onDeleteMessage,
                                               }) => {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className={styles.window}>
      {isOperator && (
        <>
          <aside className={styles.sidebar} data-open={sidebarOpen}>
            <button
              className={styles.sidebarBackButton}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <PanelLeftClose size={24}/>
            </button>
            <ChatList chats={chats} onOpenChat={(id) => {
              onOpenChat(id);
              setSidebarOpen(false);
            }}/>
          </aside>

          {sidebarOpen && (
            <button
              type="button"
              className={styles.overlay}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          )}
        </>
      )}

      {isOperator && (
        <div className={styles.header}>
          <button
            className={styles.chatListButton}
            onClick={() => setSidebarOpen(true)}
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