import React, {memo} from "react";
import {formatTime} from "@/utils/formatTime.ts";
import {Check} from "lucide-react";
import styles from './Message.module.css';

interface MessageMetaProps {
  createdAt: string;
  readByUserAt?: string;
  readByOperatorAt?: string;
  deletedAt?: string;
  editedAt?: string;
}

const MessageMeta: React.FC<MessageMetaProps> = memo(
  ({createdAt, readByOperatorAt, readByUserAt, deletedAt, editedAt}) => {
    if (deletedAt) return null;

    return (
      <div className={styles.messageMeta}>
        <span className={styles.metaTime}>{formatTime(createdAt)} |</span>
        {(readByOperatorAt || readByUserAt) && (
          <span className={styles.metaReadIcon}>
               <Check size={12}/>
              </span>
        )}
        {editedAt && <span className={styles.editedMark}>| Edited</span>}
      </div>
    );
  },
);

export default MessageMeta;