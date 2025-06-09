import React from "react";
import {SendHorizonal} from "lucide-react";
import styles from "./MessageInput.module.css";
import clsx from "clsx";

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({onClick, disabled}) => (
  <button
    className={clsx(styles.sendButton)}
    onClick={onClick}
    disabled={disabled}
    aria-label="Send message"
    type="button"
  >
    <SendHorizonal size={32}/>
  </button>
);

export default SendButton;