import React from "react";
import {FileAudio, FileCheck, FileVideo, X} from "lucide-react";
import styles from "./MessageInput.module.css";

interface Props {
  file?: { file_url: string; mediaType: string } | null;
  onRemove: () => void;
  loading?: boolean;
}

const FileInputPreview: React.FC<Props> = ({file, onRemove, loading}) => {
  if (!file) return null;

  let preview;
  const type = file.mediaType.split('/')[0];

  switch (type) {
    case 'image':
      preview = <img src={file.file_url} className={styles.previewImage} alt="preview"/>;
      break;
    case 'video':
      preview = (
        <span className={styles.previewIcon}>
        <FileVideo size={16} width={16} height={16}/>
      </span>
      );
      break;
    case 'audio':
      preview = (
        <span className={styles.previewIcon}>
        <FileAudio size={16} width={16} height={16}/>
      </span>
      );
      break;
    default:
      preview = (
        <span className={styles.previewIcon}>
        <FileCheck size={16} width={16} height={16}/>
      </span>
      );
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
        <X size={16} width={16} height={16}/>
      </button>
    </div>
  );
};

export default FileInputPreview;
