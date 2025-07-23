# Auction-of-paintings-fullstack

Start:poetry run uvicorn src.main:app --reload

## 🔧 Технологический стек

* **Язык:** Python 3.11+
* **Фреймворк:** FastAPI
* **База данных:** PostgreSQL (через SQLAlchemy)
* **Аутентификация:** OAuth2 + JWT
* **WebSockets:** Для ставок в реальном времени
* **Фоновая обработка:** Celery + Redis (для задач типа уведомлений, завершения торгов)
* **Хранение изображений:** S3 или локально через Static Files
* **Контейнеризация:** Docker + docker-compose
* **Миграции:** Alembic
* **Тестирование:** Pytest

---


## 🔑 Основные модули

### 1. **Аутентификация и авторизация**

### 2. **Пользователи**

### 3. **Картины (Lots)**


### 4. **Аукционы**

* Каждый лот имеет `start_time`, `end_time`

* Только в активный период можно делать ставки


* Только ставка выше текущей разрешена

* Ставки должны обновляться **в реальном времени** (через WebSocket)

* Победитель фиксируется после окончания торгов

---

### 5. **WebSocket для ставок**

* Клиент подключается к `/ws/lots/{lot_id}`
* Получает текущую ставку
* Отправляет новую ставку — проверка + broadcast другим
* Закрытие соединения по окончанию лота

---

### 6. **Фоновые задачи**

* Проверка и завершение аукциона (`celery beat` или FastAPI BackgroundTasks)
* Уведомления пользователю о выигрыше (email или пуш)

---

### 7. **Админка**

---

### 8. **API (REST)**


## ✅ Дополнительно

* **Rate Limiting** — защита от ботов (можно FastAPI-limiter + Redis)
* **Logging + Monitoring** — логирование ставок, ошибок
* **Тесты** — юнит- и интеграционные тесты (на WebSocket тоже)
* **OpenAPI Docs** — автоматически генерируется FastAPI
* **CORS** — фронтенд отдельный

# 🖼️ Auction Frontend

Frontend for the online painting auction platform.

##  Stack

- Next.js 15
- React 19
- Zustand (state management)
- TypeScript

