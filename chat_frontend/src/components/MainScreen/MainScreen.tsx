import useChatApp from "../../hooks/useChatApp.ts";
import {type JSX} from "react";
import {WS_URL} from "@/config.ts";
import styles from "./MainScreen.module.css";
import {ChatLayout} from "@/components/ChatLayout";

function MainScreen(): JSX.Element {
  const chatApp = useChatApp(WS_URL);

  return (
    <div className={styles.container}>
      <ChatLayout
        connected={chatApp.connected}
        authenticated={chatApp.authenticated}
        isOperator={chatApp.isOperator}
        error={chatApp.error}
        chatId={chatApp.chatId}
        chats={chatApp.chats}
        messages={chatApp.messages}
        handleOpenChat={chatApp.onOpenChat}
        handleSendMessage={chatApp.onSendMessage}
        handleDeleteMessage={chatApp.onDeleteMessage}
      />
    </div>
  );
}

export default MainScreen;
