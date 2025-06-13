import React from "react";
import {Paperclip} from "lucide-react";
import styles from "./MessageInput.module.css";

interface Props {
  onSelect: (file: File) => void;
  disabled?: boolean;
}

const FileAttachButton: React.FC<Props> = ({onSelect, disabled}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) onSelect(e.target.files[0]);
    e.target.value = "";
  };

  return (
    <>
      <button
        className={styles.fileButton}
        onClick={handleClick}
        disabled={disabled}
        title="Input file"
        type="button"
      >
        <Paperclip size={22}/>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        style={{display: "none"}}
        onChange={handleChange}
      />
    </>
  );
};

export default FileAttachButton;