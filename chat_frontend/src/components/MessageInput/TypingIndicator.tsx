import React from "react";
import styles from "./styles/TypingIndicator.module.css";

interface TypingIndicatorProps {
  show: boolean;
  isOperator: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({show, isOperator}) =>
  show ? (
    <div className={styles.typingIndicator}>
      {isOperator ? "User is typing" : "Operator is typing"}
      <span className={styles.dots}>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
  </span>
    </div>
  ) : null;

export default TypingIndicator;