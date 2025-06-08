import useChatApp from "../../hooks/useChatApp.ts";
import {type JSX, useEffect} from "react";
import {WS_URL} from "@/config.ts";
import styles from "./MainScreen.module.css";
import {ChatLayout} from "@/components/ChatLayout";
import {postEvent} from "@telegram-apps/sdk";

function MainScreen(): JSX.Element {
  const chatApp = useChatApp(WS_URL);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      postEvent("web_app_expand")
    }
  }, []);

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
