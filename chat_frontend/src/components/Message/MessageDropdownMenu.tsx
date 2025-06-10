import React, {useRef} from "react";
import {usePopupClose} from "@/components/Message/hooks/usePopupClose.ts";
import styles from "./Message.module.css";
import {Pencil, Trash2} from "lucide-react";

interface Props {
  onConfirmEdit: () => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const MessageDropDownMenu: React.FC<Props> = ({
                                                onConfirmDelete,
                                                onCancel,
                                                onConfirmEdit,
                                              }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  usePopupClose(popupRef, onCancel);

  return (
    <div className={styles.dropdown} ref={popupRef}>
      {onConfirmEdit && (
        <button
          className={styles.menuItem}
          onClick={() => {
            onCancel();
            setTimeout(() => onConfirmEdit(), 0);
          }}
        >
          <Pencil size={8}/> Edit
        </button>
      )}
      <button
        className={styles.menuItem}
        onClick={() => {
          onCancel();
          setTimeout(() => onConfirmDelete(), 0);
        }}
      >
        <Trash2 size={8}/> Delete
      </button>
    </div>
  );
};

export default MessageDropDownMenu;
