import React from "react";
import styles from './Message.module.css';

interface Props {
  file_url: string;
  filename?: string;
}

const MessageFileAttachment: React.FC<Props> = ({file_url, filename}) => (
  <a href={file_url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
    {filename || "Download file"}
  </a>
);

export default MessageFileAttachment;
