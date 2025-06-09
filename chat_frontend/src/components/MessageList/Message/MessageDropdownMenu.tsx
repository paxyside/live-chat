import React, {useRef} from "react";
import {usePopupClose} from "@/components/MessageList/Message/hooks/usePopupClose.ts";
import styles from './Message.module.css';

interface Props {
  onConfirmEdit: () => void
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const MessageDropDownMenu: React.FC<Props> = ({onConfirmDelete, onCancel, onConfirmEdit}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  usePopupClose(popupRef, onCancel);

  return (
    <div className={styles.dropdown} ref={popupRef}>
      {onConfirmEdit && <button className={styles.menuItem} onClick={onConfirmEdit}>Edit</button>}
      <button className={styles.menuItem} onClick={onConfirmDelete}>Delete</button>
    </div>
  );
};

export default MessageDropDownMenu;