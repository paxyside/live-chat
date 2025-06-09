interface TelegramWebApp {
  initData?: string;
}

interface Window {
  typingTimeout?: ReturnType<typeof setTimeout>;
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
