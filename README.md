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
> Cтруктура fastapi приложения создана в соотвествии с репозиторием fastapi-bestpracticies([Best Practicices zhabynkanov guide](https://github.com/zhanymkanov/fastapi-best-practices))
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
* Убедитесь, что **VPN отключен**, может привести к ошибкам.

# Клонируем репозиторий
git clone https://github.com/ApertureFacility/Auction-of-paintings-fullstack.git

# Переходим в папку проекта
cd Auction-of-paintings-fullstack

---

### 2. Cоздание и настройка `.env`

#### Создаем Env для Backend, (`backend/.env`) создается по образцу \Fullstack\backend\.env.example
#### Создаем Env для Frontend, (`frontend/.env.local`) создается по образцу \Fullstack\frontend\.env.example 


### 3. Запуск через Docker Compose
> Используем команду в консоли,или в docker-compose.yml делаем run all services,ждем развертывания всех контейнеров .
```bash
docker-compose up -d --build
```


Доступные сервисы можно просмотреть внутри контейнера,либо:

* **Backend (FastAPI)** → [http://localhost:8000](http://localhost:8000)
* **Frontend (Next.js)** → [http://localhost:3000](http://localhost:3000)
* **Mailhog UI** → [http://localhost:8025](http://localhost:8025)



### 5. Восстановление дампа БД (опционально в случае ошибки восстановления бэкапа бд докером)

> Дамп содержит тестовый набор данных (пользователь, лоты).В compose уже есть сервис для развертки бэкапа,но в случае ошибок,проверяем наличие таблиц в БД,если нету,накатываем командами,обращайте внимание на путь к файлу в первой команде!

```bash
docker cp "db\init\backup.sql" postgres-db:/backup.sql
docker exec -it postgres-db psql -U postgres -d fastapi -f /backup.sql
```

---

## Тестовый доступ

В базе данных уже есть тестовый пользователь:

* **Логин:** `test@gmail.com`
* **Пароль:** `13`

## Работа с избранными лотами

* Добавлять и удалять лоты в избранное можно с помощью иконки ⭐ на главной странице.
* Управлять избранным также можно во вкладке **Personal → Favorites** (просмотр и удаление).

## Восстановление пароля

1. На форме входа нажмите **«Забыли пароль?»**.
2. Введите email тестового пользователя.
3. Перейдите на [MailHog](http://localhost:8025/) → **Inbox**.
4. В полученном письме нажмите кнопку для смены пароля.
5. Установите новый пароль.
6. Войдите в систему с обновлёнными данными.

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
| `POST` | `/auth/cookie/login`         | Логин (access-cookie) (email,password)        |
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
Запускаем бд в Postgres,накатываем бэкап из папки init командой из шага восстановления БД

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

## ✅ Основные возможности

* 🔑 Регистрация и вход пользователей (JWT + cookies)
* 🎨 Управление лотами (картины)
* ⚡ Реальные ставки через WebSocket и история ставок
* 📅 Автоматическое завершение аукционов
* 📩 Email-уведомления (Mailhog)
* 🧪 Тесты (Pytest + pytest-asyncio)
* 📄 OpenAPI-документация (авто) → `localhost8000/docs`

---

## ℹ️ Примечания и рекомендации

* Проверьте значения переменных окружения перед запуском.
* Для локального тестирования почты используется Mailhog ([http://localhost:8025](http://localhost:8025)).
* Если у вас есть ошибки с бд,проверьте их наличие в базе данных Контейнера,если их нет используйте дамп БД — восстановите его после поднятия сервисов.

---


