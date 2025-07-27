from fastapi_users.db import SQLAlchemyUserDatabase
from src.core.db import async_session_maker
from .models import User
from src.core.config import settings
from fastapi_users import BaseUserManager, IntegerIDMixin

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    user_db_model = User
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET

async def get_user_manager():
    async with async_session_maker() as session:
        yield UserManager(SQLAlchemyUserDatabase(session, User))
