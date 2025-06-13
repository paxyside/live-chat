import React from "react";
import styles from "./Message.module.css";
import {Check, X} from "lucide-react";

interface MessageEditInputProps {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const MessageEditInput: React.FC<MessageEditInputProps> = ({value, onChange, onSave, onCancel}) => (
  <div className={styles.editInputWrapper}>
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
    <button className={styles.editSaveBtn} onClick={onSave}>
      <Check size={14} width={14} height={14}/>
    </button>
    <button className={styles.editCancelBtn} onClick={onCancel}>
      <X size={14} width={14} height={14}/>
    </button>
  </div>
);

export default MessageEditInput;