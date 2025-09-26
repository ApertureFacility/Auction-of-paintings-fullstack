import asyncio
from fastapi_users.db import SQLAlchemyUserDatabase
from src.email.service import send_reset_password_email
from src.core.db import async_session_maker
from .models import User
from src.core.config import settings
from fastapi_users import BaseUserManager, IntegerIDMixin


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    user_db_model = User
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET

    async def on_after_forgot_password(self, user: User, token: str, request=None):
        reset_link = f"http://localhost:3000/reset-password/{token}"
        asyncio.create_task(send_reset_password_email(user.email, reset_link))


async def get_user_manager():
    """
    Провайдер UserManager для внедрения зависимостей.

    Создает асинхронную сессию SQLAlchemy и 
    возвращает UserManager, связанный с User моделью.
    """
    async with async_session_maker() as session:
        yield UserManager(SQLAlchemyUserDatabase(session, User))
