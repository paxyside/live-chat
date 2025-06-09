import React from "react";
import styles from "./Message.module.css";

interface MessageEditInputProps {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MessageEditInput: React.FC<MessageEditInputProps> = ({value, onChange, onSave, onCancel}) => (
  <div className={styles.editContainer}>
    <input
      className={styles.editInput}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") onSave();
        if (e.key === "Escape") onCancel();
      }}
      autoFocus
    />
    <button className={styles.editSaveBtn} onClick={onSave}>Сохранить</button>
    <button className={styles.editCancelBtn} onClick={onCancel}>Отмена</button>
  </div>
);

export default MessageEditInput;