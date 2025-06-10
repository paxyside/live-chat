import React, {useCallback, useState} from "react";
import MessageList from "../MessageList/MessageList.tsx";
import MessageInput from "../MessageInput/MessageInput.tsx";
import ChatWindowSidebar from "./ChatWindowSidebar";
import ChatWindowSidebarOverlay from "./ChatWindowSidebarOverlay";
import ChatWindowHeader from "./ChatWindowHeader";
import type {ChatMessage, ChatWithLastMessage, UploadedFile} from "@/types";
import styles from "./ChatWindow.module.css";

interface ChatWindowProps {
  chatId: number | null;
  messages: ChatMessage[];
  chats: ChatWithLastMessage[] | [];
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement> | File) => Promise<UploadedFile | null>;
  onSendMessage: (message: string, file_url: string) => void;
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
                                                 onFileInputChange,
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
  const [pendingFile, setPendingFile] = useState<UploadedFile | null>(null);

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement> | File
  ): Promise<UploadedFile | null> => {
    const result = await onFileInputChange(e);
    if (result && result.file_url) {
      setPendingFile(result);
    }
    return result;
  };

  const handleSend = useCallback((text: string) => {
    onSendMessage(text, pendingFile?.file_url || '');
    setPendingFile(null);
    setInput('');
  }, [onSendMessage, pendingFile]);

  const chatTyping = chatId && typing ? typing[chatId] : {user: false, operator: false};

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
          <ChatWindowHeader onOpenSidebar={() => setSidebarOpen(true)}/>
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
        onFileInputChange={handleFileInputChange}
        onSend={handleSend}
        typing={chatTyping}
        onTyping={onTyping ?? (() => {
        })}
        isOperator={isOperator}
      />
    </div>
  );
};

export default ChatWindow;