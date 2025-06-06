import React, {useRef} from "react";
import {usePopupClose} from "@/components/MessageList/Message/hooks/usePopupClose.ts";
import styles from './Message.module.css';


interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const MessageDeletePopup: React.FC<Props> = ({onConfirm, onCancel}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  usePopupClose(popupRef, onCancel);

  return (
    <div className={styles.deleteMessagePopup} ref={popupRef}>
      <button className={styles.deleteMessagePopupButton} onClick={onConfirm}>Удалить</button>
    </div>
  );
};

export default MessageDeletePopup;