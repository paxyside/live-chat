import React from "react";
import {SendHorizonal} from "lucide-react";
import styles from "./MessageInput.module.css";
import clsx from "classnames";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<Props> = ({input, setInput, onSend}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
  );
};

export default MessageInput;