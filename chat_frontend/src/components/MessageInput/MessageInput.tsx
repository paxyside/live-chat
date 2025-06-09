import React, {useRef} from "react";
import styles from "./MessageInput.module.css";
import TypingIndicator from "@/components/MessageInput/TypingIndicator.tsx";
import SendButton from "@/components/MessageInput/SendButton.tsx";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  typing: { user: boolean; operator: boolean };
  onTyping: () => void;
  isOperator: boolean;
}

const MessageInput: React.FC<Props> = ({input, setInput, onSend, typing, onTyping, isOperator}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  const lastTypedRef = useRef(0);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const now = Date.now();
    if (now - lastTypedRef.current > 1000) {
      onTyping();
      lastTypedRef.current = now;
    }
  };

  const safeTyping = typing || {user: false, operator: false};
  const showTyping = isOperator ? safeTyping.user : safeTyping.operator;

  return (
    <>
      <TypingIndicator show={showTyping} isOperator={isOperator}/>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={handleInput}
          placeholder="Enter message..."
          onKeyDown={handleKeyDown}
        />
        <SendButton onClick={onSend} disabled={!input.trim()}/>
      </div>
    </>
  );
};

export default MessageInput;