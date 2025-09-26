# 🎨 Auction of Paintings – Fullstack App

Онлайн-аукцион картин в реальном времени. Бэкенд на **FastAPI + PostgreSQL**, фронтенд — на **Next.js + React**, контейнеризация — через **Docker Compose**.

---

**Backend**

* Python 3.11+
* FastAPI 0.116+
* SQLAlchemy 2.x + Alembic
* PostgreSQL 15
* fastapi-users (OAuth2 + JWT)
* WebSockets (ставки в реальном времени)
* FastAPI-Mail (уведомления через SMTP → Mailhog)
* Poetry (dependency manager)

**Frontend**

* Next.js 15
* React 19
* TypeScript
* Zustand (стейт-менеджер)
* Axios
* Framer Motion

**Infrastructure**

* Docker + docker-compose
* PostgreSQL
* Mailhog (SMTP тестирование)

---

## 📂 Структура проекта

```
.
├── backend/             # FastAPI-приложение
├── frontend/            # Next.js клиент
├── db/                  # SQL-дампы и init-скрипты
├── docker-compose.yml   # запуск инфраструктуры
└── README.md
```

---

## ⚙️ Установка и запуск (Docker)

### 1. Подготовка

* Установите [Docker](https://docs.docker.com/get-docker/) и [docker-compose](https://docs.docker.com/compose/).
* Убедитесь, что **VPN отключен** (Postgres может не подключиться).

### 2. Настройка `.env`

#### Backend (`backend/.env`)
#### Frontend (`frontend/.env.local`)


*Для  ENV BACKEND ознакомьтесь с example \Fullstack\backend\.env.example 
*Для  ENV FRONTEND ознакомьтесь с example \Fullstack\frontend\.env.example 



```env
NEXT_PUBLIC_API_URL=http://localhost:8000
SERVER_API_URL=http://backend:8000
```

### 3. Запуск через Docker Compose

```bash
docker-compose up -d --build
```

Доступные сервисы:

* **Backend (FastAPI)** → [http://localhost:8000](http://localhost:8000)
* **Frontend (Next.js)** → [http://localhost:3000](http://localhost:3000)
* **Mailhog UI** → [http://localhost:8025](http://localhost:8025)
* **PostgreSQL** → порт `5555` (локальные подключения)

### 4. Применение миграций

```bash
docker exec -it fastapi-backend alembic upgrade head
```

### 5. Восстановление дампа БД (опционально)

> Дамп содержит тестовый набор данных (пользователь, лоты).

```bash
docker cp "C:\Users\Admin\Desktop\Fullstack\db\init\backup.sql" postgres-db:/backup.sql
docker exec -it postgres-db psql -U postgres -d fastapi -f /backup.sql
```

---

## 🔑 Аутентификация

Проект использует библиотеку [fastapi-users](https://frankie567.github.io/fastapi-users/) с JWT и cookie-авторизацией.

* **Access токен** (`auth` cookie) — живёт 1 час.
* **Refresh токен** (`refresh` cookie) — живёт 30 дней.
* Все токены — **JWT**.
* Авторизация в роутерах реализована через `Depends(current_active_user)`.

### Основные эндпоинты

| Метод  | URL                          | Описание                                      |
| ------ | ---------------------------- | --------------------------------------------- |
| `POST` | `/auth/cookie/login`         | Логин (access-cookie)                         |
| `POST` | `/auth/cookie/login-refresh` | Логин с установкой access + refresh cookies   |
| `POST` | `/auth/cookie/refresh`       | Обновление access-токена через refresh cookie |
| `POST` | `/auth/cookie/logout`        | Выход (очистка cookies)                       |
| `POST` | `/auth/register`             | Регистрация                                   |
| `GET`  | `/users/me`                  | Текущий пользователь                          |

### Использование на фронтенде

* При логине сервер выставляет `Set-Cookie` с токенами.
* Все авторизованные запросы выполняются с этими cookies автоматически (при `fetch`/`axios` с `credentials: 'include'`).
* Для проверки текущего пользователя используйте `/users/me`.

---

## 📡 WebSocket (Ставки в реальном времени)

> Этот раздел вставлен после блока про аутентификацию и описывает протокол WS для работы с лотами.

Для каждого лота используется отдельный WebSocket-канал:

```
ws://localhost:8000/ws/lots/{lot_id}
```

### Типы сообщений

Типы сообщений

NEW_BID — от клиента к серверу: { "type": "NEW_BID", "user_id": 1, "amount": 150.0 }. От сервера: широковещательное сообщение о новой ставке всем подключённым клиентам.

GET_HISTORY — от клиента: запрос последних 20 ставок по лоту. От сервера: ответ в виде сообщения BID_HISTORY, содержащего массив последних ставок.

CLOSE_AUCTION — от клиента: инициирует принудительное завершение аукциона (доступно только администратору). От сервера: сообщение AUCTION_ENDED, подтверждающее завершение аукциона.

LOT_STATUS — от сервера: текущее состояние лота (активен/не активен, текущая цена, владелец). Сервер отправляет это сообщение сразу после подключения клиента; клиент не отправляет LOT_STATUS.

USERS_COUNT — от сервера: число подключённых пользователей для данного канала; рассылается при подключении/отключении участников.

BID_HISTORY — от сервера: последние 20 ставок (ответ на GET_HISTORY). Клиент не генерирует BID_HISTORY самостоятельно.

AUCTION_ENDED — от сервера: уведомление о завершении аукциона и финальном состоянии лота.

ERROR — от сервера: сообщение об ошибке при обработке входящего сообщения или при работе WebSocket-сессии.

LOT_STATUS сервер отправляет автоматически после подключения (клиент не должен запрашивать его).

USERS_COUNT обновляется и рассылается при каждом подключении/отключении пользователя.

BID_HISTORY отправляется сервером в ответ на GET_HISTORY и содержит упорядоченный список последних ставок.

AUCTION_ENDED используется сервером для оповещения всех подключённых клиентов о завершении аукциона.


### Пример подключения (JS)

```js
const ws = new WebSocket("ws://localhost:8000/ws/lots/1");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("WS:", data);
};

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "NEW_BID",
    user_id: 1,
    amount: 200
  }));
};
```

---

## 🛠️ Запуск локально (без Docker)

### Backend

```bash
cd backend
poetry install
poetry run uvicorn src.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Полезные команды

### Логи

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f mailhog
```

### Остановка

```bash
docker-compose down
```

### Пересборка

```bash
docker-compose up -d --build
```

### Вход в контейнер

```bash
docker exec -it fastapi-backend bash
```

---

## ✅ Основные возможности

* 🔑 Регистрация и вход пользователей (JWT + cookies)
* 🎨 Управление лотами (картины)
* ⚡ Реальные ставки через WebSocket
* 📅 Автоматическое завершение аукционов
* 📩 Email-уведомления (Mailhog)
* 🧪 Тесты (Pytest + pytest-asyncio)
* 📄 OpenAPI-документация (авто) → `/docs`

---

## ℹ️ Примечания и рекомендации

* Проверьте значения переменных окружения перед запуском (особенно `DATABASE_URL` и SMTP-настройки).
* Для локального тестирования почты используется Mailhog ([http://localhost:8025](http://localhost:8025)).
* Если у вас есть дамп БД — восстановите его после поднятия сервисов и применения миграций.

---
