import React, {memo} from "react";
import {formatTime} from "@/utils/formatTime.ts";
import {Check} from "lucide-react";
import styles from './Message.module.css';

interface MessageMetaProps {
  createdAt: string;
  readByUserAt?: string;
  readByOperatorAt?: string;
  deletedAt?: string;
}

const MessageMeta: React.FC<MessageMetaProps> = memo(
  ({createdAt, readByOperatorAt, readByUserAt, deletedAt}) => {
    if (deletedAt) return null;

    let readStatusClass = "";
    if (readByOperatorAt) {
      readStatusClass = styles.fromOperatorMetaIcon;
    } else if (readByUserAt) {
      readStatusClass = styles.fromUserMetaIcon;
    }

    return (
      <div className={styles.messageMeta}>
        <span className={styles.metaTime}>{formatTime(createdAt)}</span>
        {(readByOperatorAt || readByUserAt) && (
          <span className={readStatusClass}>
                <Check size={12}/>
              </span>
        )}
      </div>
    );
  },
);

export default MessageMeta;