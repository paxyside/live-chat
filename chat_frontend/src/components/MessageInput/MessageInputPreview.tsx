import React from "react";
import {FileAudio, FileCheck, FileVideo, X} from "lucide-react";
import styles from "./styles/MessageInput.module.css";

interface Props {
  file?: { file_url: string; mediaType: string } | null;
  onRemove: () => void;
  loading?: boolean;
}

const MessageInputPreview: React.FC<Props> = ({file, onRemove, loading}) => {
  if (!file) return null;
  let preview = null;
  if (file.mediaType.startsWith("image")) {
    preview = <img src={file.file_url} className={styles.previewImage} alt="preview"/>;
  } else if (file.mediaType.startsWith("video")) {
    preview = <span className={styles.previewIcon}>
      <FileVideo size={16}/>
    </span>;
  } else if (file.mediaType.startsWith("audio")) {
    preview = <span className={styles.previewIcon}>
      <FileAudio size={16}/>
    </span>;
  } else {
    preview = <span className={styles.previewIcon}>
      <FileCheck size={16}/>
    </span>;
  }
  return (
    <div className={styles.previewContainer}>
      {preview}
      <button
        className={styles.removeBtn}
        onClick={onRemove}
        disabled={loading}
        aria-label="Delete attachment"
      >
        <X size={16}/>
      </button>
    </div>
  );
};

export default MessageInputPreview;
