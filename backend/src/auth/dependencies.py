import uuid
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import BearerTransport, AuthenticationBackend, JWTStrategy

from .models import User
from .manager import get_user_manager
from src.core.config import settings


#  Bearer через заголовки HTTP
# tokenUrl указывает эндпоинт для логина, который будет использоваться в Swagger UI.
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    """
    Создаёт стратегию аутентификации с помощью JWT.

    Returns:
        JWTStrategy: Стратегия с секретным ключом и временем жизни токена.
    """
    return JWTStrategy(secret=settings.SECRET, lifetime_seconds=3600)


# Backend аутентификации: FastAPI Users будет использовать JWT через Bearer-токен.
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


# FastAPIUsers — основная точка интеграции.
# Параметры [User, int]:
#   User — это модель пользователя (SQLAlchemy).
#   int — тип первичного ключа пользователя.
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)



# Депенденси для проверки текущего пользователя.
# Используется в роутерах как Depends(current_active_user).
# active=True гарантирует, что пользователь не заблокирован.
current_active_user = fastapi_users.current_user(active=True)
