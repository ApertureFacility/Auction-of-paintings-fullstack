from fastapi_users.db import SQLAlchemyUserDatabase
from src.core.db import async_session_maker
from .models import User
from src.core.config import settings
from fastapi_users import BaseUserManager, IntegerIDMixin


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """
    Менеджер пользователей для FastAPI Users.
    Наследуется от
    - IntegerIDMixin: работа с числовыми ID пользователей.
    - BaseUserManager: базовая логика управления пользователями 
      (регистрация, верификация, сброс пароля и т.п.).

    Атрибуты:
        user_db_model: модель SQLAlchemy для работы с таблицей пользователей.
        reset_password_token_secret: секрет для токенов сброса пароля.
        verification_token_secret: секрет для токенов подтверждения email.
    """
    user_db_model = User
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET


async def get_user_manager():
    """
    Провайдер UserManager для внедрения зависимостей.

    Создает асинхронную сессию SQLAlchemy и 
    возвращает UserManager, связанный с User моделью.
    """
    async with async_session_maker() as session:
        yield UserManager(SQLAlchemyUserDatabase(session, User))
