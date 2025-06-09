import React, {memo} from "react";
import styles from "./Message.module.css";

interface MessageBubbleProps {
  children: React.ReactNode;
  isOperator: boolean;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = memo(
  ({children, isOperator, className}) => (
    <div
      className={`${styles.messageBubble} ${isOperator ? styles.fromOperatorBubble : ""}${className ? " " + className : ""}`}
    >
      {children}
    </div>
  ),
);

export default MessageBubble;
