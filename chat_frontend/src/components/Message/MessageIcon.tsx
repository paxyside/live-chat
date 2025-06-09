import React, {memo} from "react";
import {User, UserRoundCog} from "lucide-react";
import styles from './Message.module.css';

interface MessageIconProps {
  isOperator: boolean;
}

const MessageIcon: React.FC<MessageIconProps> = memo(({isOperator}) => {
  const Icon = isOperator ? UserRoundCog : User;
  const iconColor = isOperator
    ? "var(--message-operator)"
    : "var(--message-user)";
  return <Icon className={`${styles.messageIcon} ${isOperator ? styles.fromOperatorIcon : ""}`}
               style={{color: iconColor}}/>;
});

export default MessageIcon;
