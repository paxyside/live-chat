import styles from "./ChatListItem.module.css";

export const ChatTitle = ({tgId}: { tgId: number }) => (
  <div className={styles.title}>#{tgId}</div>
);