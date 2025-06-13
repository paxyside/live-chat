import React from "react";
import styles from "./MessageInput.module.css";

interface TypingIndicatorProps {
  show: boolean;
  isOperator: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
                                                           show,
                                                           isOperator,
                                                         }) =>
  show ? (
    <div className={styles.typingIndicator}>
      {isOperator ? "Operator is typing" : "User is typing"}
      <span className={styles.dots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </span>
    </div>
  ) : null;

export default TypingIndicator;
