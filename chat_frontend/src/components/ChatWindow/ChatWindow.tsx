import React, {useState} from "react";
import MessageList from "../MessageList/MessageList.tsx";
import MessageInput from "../MessageInput/MessageInput.tsx";
import ChatWindowSidebar from "./ChatWindowSidebar";
import ChatWindowSidebarOverlay from "./ChatWindowSidebarOverlay";
import ChatWindowHeader from "./ChatWindowHeader";
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
  onEditMessage?: (chatId: number, messageId: number, content: string) => void;
  typing?: Record<number, { user: boolean; operator: boolean }>;
  onTyping?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
                                                 chatId,
                                                 messages,
                                                 chats,
                                                 onSendMessage,
                                                 isOperator,
                                                 onOpenChat,
                                                 onDeleteMessage,
                                                 onEditMessage,
                                                 typing,
                                                 onTyping
                                               }) => {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const chatTyping = chatId && typing ? typing[chatId] : { user: false, operator: false };

  return (
    <div className={styles.window}>
      {isOperator && (
        <>
          <ChatWindowSidebar
            chats={chats}
            onOpenChat={onOpenChat}
            onClose={() => setSidebarOpen(false)}
            sidebarOpen={sidebarOpen}
          />
          {sidebarOpen && (
            <ChatWindowSidebarOverlay
              onClose={() => setSidebarOpen(false)}
              sidebarOpen={sidebarOpen}
            />
          )}
          <ChatWindowHeader onOpenSidebar={() => setSidebarOpen(true)} />
        </>
      )}

      <div className={styles.messageListWrapper}>
        <MessageList
          chatId={chatId}
          messages={messages}
          isOperator={isOperator}
          onDelete={onDeleteMessage}
          onEdit={onEditMessage}
        />
      </div>

      <MessageInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        typing={chatTyping}
        onTyping={onTyping || (() => {})}
        isOperator={isOperator}
      />
    </div>
  );
};

export default ChatWindow;