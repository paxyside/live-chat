import React, {useEffect, useState} from "react";
import styles from './Message.module.css';

interface Props {
  file_url: string;
  filename?: string;
}

const MessageImageAttachment: React.FC<Props> = ({file_url, filename}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <>
      <img
        src={file_url}
        alt={filename || "file"}
        className={styles.filePreviewImage}
        style={{cursor: 'zoom-in'}}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <img src={file_url} alt={filename || "file-full"} className={styles.modal}/>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageImageAttachment;
