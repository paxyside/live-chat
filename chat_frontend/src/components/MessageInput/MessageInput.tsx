import React, {useRef} from "react";
import {SendHorizonal} from "lucide-react";
import styles from "./MessageInput.module.css";
import clsx from "classnames";

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
      {showTyping && (
        <div className={styles.typingIndicator}>
          {isOperator ? "User is typing..." : "Operator is typing..."}
        </div>
      )}
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={handleInput}
          placeholder="Enter message..."
          onKeyDown={handleKeyDown}
        />
        <button
          className={clsx(styles.sendButton)}
          onClick={onSend}
          disabled={!input.trim()}
          aria-label="Send message"
          type="button"
        >
          <SendHorizonal size={32}/>
        </button>
      </div>
    </>
  );
};

export default MessageInput;