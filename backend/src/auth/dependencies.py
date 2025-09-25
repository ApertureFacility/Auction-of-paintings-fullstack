from fastapi_users import FastAPIUsers
from .models import User
from .manager import get_user_manager
from fastapi_users.authentication import CookieTransport, AuthenticationBackend, JWTStrategy
from src.core.config import settings


#  Bearer через заголовки HTTP
# tokenUrl указывает эндпоинт для логина, который будет использоваться в Swagger UI.
# Access-токен (короткоживущий)
cookie_transport = CookieTransport(
    cookie_name="auth",
    cookie_max_age=3600,   # 1 час
    cookie_secure=False,
    cookie_httponly=True,
)

refresh_transport = CookieTransport(
    cookie_name="refresh",
    cookie_max_age=60 * 60 * 24 * 30,  # 30 дней
    cookie_secure=False,
    cookie_httponly=True,
)

def get_access_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.SECRET, lifetime_seconds=3600)

def get_refresh_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.SECRET, lifetime_seconds=60 * 60 * 24 * 30)


# --- Authentication backends ---
auth_backend = AuthenticationBackend(
    name="access",
    transport=cookie_transport,
    get_strategy=get_access_strategy,
)


refresh_backend = AuthenticationBackend(
    name="refresh",
    transport=refresh_transport,
    get_strategy=get_refresh_strategy,
)


# --- FastAPI Users ---
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend, refresh_backend],  # подключаем оба бэкенда
)




# Депенденси для проверки текущего пользователя.
# Используется в роутерах как Depends(current_active_user).
# active=True гарантирует, что пользователь не заблокирован.
current_active_user = fastapi_users.current_user(active=True)
