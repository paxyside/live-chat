import React from "react";
import styles from "./ErrorMessage.module.css";

interface Props {
  error: string | null;
}

const ErrorMessage: React.FC<Props> = ({error}) => {
  if (!error) return null;
  return <div className={styles.error}>{error}</div>;
};

export default ErrorMessage;