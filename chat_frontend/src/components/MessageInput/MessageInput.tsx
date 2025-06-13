import React, {useRef, useState} from "react";
import SendButton from "@/components/MessageInput/SendButton";
import TypingIndicator from "@/components/MessageInput/TypingIndicator";
import FileInputPreview from "@/components/MessageInput/FileInputPreview";
import InputField from "@/components/MessageInput/InputField.tsx";
import type {UploadedFile} from "@/types";
import styles from "./MessageInput.module.css";
import FileAttachButton from "@/components/MessageInput/FileAttachButton.tsx";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string, file_url?: string) => void;
  typing: { user: boolean; operator: boolean };
  onTyping: () => void;
  isOperator: boolean;
  onFileInputChange?: (
    e: React.ChangeEvent<HTMLInputElement> | File,
  ) => Promise<UploadedFile | null>;
}

const MessageInput = ({
                        input,
                        setInput,
                        onSend,
                        typing,
                        onTyping,
                        isOperator,
                        onFileInputChange,
                      }: Props) => {
  const [pendingFile, setPendingFile] = useState<UploadedFile | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() && !pendingFile) return;
    onSend(input.trim(), pendingFile?.file_url);
    setInput("");
    setPendingFile(null);
  };

  const handleInputFileChange = async (
    e: React.ChangeEvent<HTMLInputElement> | File,
  ) => {
    setFileLoading(true);
    try {
      if (onFileInputChange) {
        const result = await onFileInputChange(e);
        if (result?.file_url) setPendingFile(result);
      }
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) await handleInputFileChange(file);
      }
    }
  };

  const handleRemoveFile = () => setPendingFile(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    onTyping();
  };

  const safeTyping = typing || {user: false, operator: false};
  const showTyping = isOperator ? safeTyping.user : safeTyping.operator;

  return (
    <div className={styles.inputWrapper}>
      <TypingIndicator show={showTyping} isOperator={isOperator}/>
      <div className={styles.messageInput}>
        <FileInputPreview
          file={pendingFile}
          onRemove={handleRemoveFile}
          loading={fileLoading}
        />

        <FileAttachButton
          onSelect={handleInputFileChange}
          disabled={fileLoading}
        />

        <InputField
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={fileLoading}
          inputRef={textAreaRef}
        />

        <SendButton
          disabled={fileLoading || (!input.trim() && !pendingFile)}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default MessageInput;
