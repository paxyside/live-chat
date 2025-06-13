import React from "react";
import styles from "./MessageInput.module.css";

interface Props {
  value: string,
  onChange: (v: string) => void,
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
  disabled?: boolean,
  inputRef?: React.RefObject<HTMLTextAreaElement | null>,
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => Promise<void>
}

const InputField: React.FC<Props> = ({value, onChange, onKeyDown, disabled, inputRef, onPaste}) => (
  <textarea
    ref={inputRef}
    className={styles.inputField}
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    disabled={disabled}
    placeholder="Enter your message..."
    rows={1}
    autoComplete="off"
    spellCheck={true}
  />
);

export default InputField;
