import React, {memo} from "react";
import {User, UserRoundCog} from "lucide-react";
import styles from './Message.module.css';

interface MessageIconProps {
  isOperator: boolean;
}

const MessageIcon: React.FC<MessageIconProps> = memo(({isOperator}) => {
  const Icon = isOperator ? UserRoundCog : User;

  return <Icon className={`${styles.fromUserIcon} ${isOperator ? styles.fromOperatorIcon : ""}`}/>;
});

export default MessageIcon;
