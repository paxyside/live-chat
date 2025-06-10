import React, {useEffect, useState} from "react";
import styles from './Message.module.css';

interface Props {
  file_url: string;
  filename?: string;
}

const MessageAudioAttachment: React.FC<Props> = ({file_url, filename}) => {
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
      <audio
        src={file_url}
        controls
        className={styles.filePreviewAudio}
        style={{cursor: 'zoom-in'}}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <audio src={file_url} controls autoPlay className={styles.modal}/>
            <div style={{color: '#fff', marginTop: 12, fontSize: 15}}>{filename}</div>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageAudioAttachment;
