import React, {useEffect, useState} from "react";
import styles from './Message.module.css';

interface Props {
  file_url: string;
  filename?: string;
}

const MessageVideoAttachment: React.FC<Props> = ({file_url}) => {
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
      <video
        src={file_url}
        className={styles.filePreviewVideo}
        style={{cursor: 'zoom-in'}}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <video
              src={file_url}
              controls
              autoPlay
              className={styles.modal}
              style={{maxWidth: '80vw', maxHeight: '60vh'}}
            />
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageVideoAttachment;
