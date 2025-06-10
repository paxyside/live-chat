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
            onConfirmEdit();
            onCancel();
          }}
        >
          <Pencil size={16}/> Edit
        </button>
      )}
      <button
        className={styles.menuItem}
        onClick={() => {
          onConfirmDelete();
          onCancel();
        }}
      >
        <Trash2 size={16}/> Delete
      </button>
    </div>
  );
};

export default MessageDropDownMenu;
