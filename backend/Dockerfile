# Python
FROM python:3.11-slim

#  Poetry
RUN pip install --no-cache-dir poetry

# Рабочая директория
WORKDIR /app

# pyproject.toml и poetry.lock
COPY pyproject.toml poetry.lock ./

# зависимости 
RUN poetry install --no-root --only main

# Копируем весь код
COPY . .

# Запуск uvicorn
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
