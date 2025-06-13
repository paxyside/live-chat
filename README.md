[![Go Backend](https://img.shields.io/badge/Backend-Go_1.24-blue?logo=go)](https://golang.org)
[![React Frontend](https://img.shields.io/badge/Frontend-React_19-blue?logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_17-blue?logo=postgresql)](https://www.postgresql.org)
[![WebSocket](https://img.shields.io/badge/Realtime-WebSocket-green?logo=websocket)](https://developer.mozilla.org/docs/Web/API/WebSockets_API)
[![Docker](https://img.shields.io/badge/DevOps-Docker-blue?logo=docker)](https://www.docker.com)
[![Telegram Auth](https://img.shields.io/badge/Auth-Telegram-blue?logo=telegram)](https://core.telegram.org/bots/webapps)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

# Live Chat Support

Многоуровневый сервис поддержки с real-time чатом между пользователями и операторами, интеграцией с Telegram, хранением истории сообщений и поддержкой файловых вложений.

---

## Архитектура

- **Backend**: Go 1.24 (Gin, WebSocket, PostgreSQL, Viper, миграции)
- **Frontend**: React 19 + TypeScript + Vite, TailwindCSS, WebSocket-клиент, Telegram Mini Apps SDK
- **Инфраструктура**: Docker Compose (backend, postgres, [nginx]), .env, Makefile

### Схема работы
- Пользователь аутентифицируется через Telegram Mini App
- Веб-клиент подключается к WebSocket серверу
- Оператор и пользователь могут обмениваться сообщениями в реальном времени
- Поддержка загрузки файлов, уведомлений, ролей, истории чатов

---

## Основной функционал
- **WebSocket чат**: мгновенный обмен сообщениями, статус "печатает", real-time обновления
- **Telegram Auth**: безопасная аутентификация через Telegram
- **Операторы**: отдельная роль, видят все чаты, получают алерты о новых сообщениях
- **История**: хранение сообщений и чатов в PostgreSQL
- **Файлы**: загрузка файлов через REST, отдача статики в чат с рендером
- **Уведомления**: алерты операторам в чат бота
- **Миграции**: автоматическое применение при старте

---

## Быстрый старт

- Клонируйте репозитории:
```bash
git clone https://github.com/paxyside/live-chat
cd live-chat
```

- Установите зависимости:
```bash
cd chat_frontend
npm install
cd ../chat_backend
go mod tidy
```

- Переменные окружения:
```bash
cp chat_backend/.env.example chat_backend/.env
cp chat_backend/config.yaml.example chat_backend/config.yaml
cp chat_frontend/.env.example chat_frontend/.env
```

- Соберите бэкенд и фронтенд:
```bash
cd chat_backend
docker compose up --build -d
cd ../chat_frontend
npm run build
```

- Backend: http://localhost:8008
- WebSocket: ws://localhost:8009/ws
- Frontend: (сборка в dist/ и отдача через nginx или локально через Vite)

---

## Переменные окружения (пример)

**chat_backend/.env.example**
```
GIN_MODE = debug

AUTH_SECRET_KEY=any_secret_key
DB_URI=postgresql://postgres:pass@database:5432/postgres?sslmode=disable
TELEGRAM_BOT_TOKEN=BOT:TOKEN

PG_PORT=9911
PG_USER=postgres
PG_PASSWORD=pass
PG_DB=postgres
```

**chat_frontend/.env.example**
```
VITE_APP_WEBSOCKET_URL=ws://localhost:8009/ws
VITE_APP_API_URL=http://localhost:8008
VITE_APP_API_AUTH_TOKEN=API_AUTH_TOKEN
```

---

## Технологии и библиотеки

- **Backend**: Gin, Gorilla WebSocket, Viper, PostgreSQL (pgx), godotenv, migrate, Telegram Mini Apps SDK
- **Frontend**: React, Vite, TailwindCSS, Telegram Mini Apps SDK, WebSocket API
- **Инфраструктура**: Docker, docker-compose, nginx (опционально), Makefile

---

## Разработка

- Backend: `make lint`, `make tests`, `make local_run`
- Frontend: `npm run dev` (Vite)
