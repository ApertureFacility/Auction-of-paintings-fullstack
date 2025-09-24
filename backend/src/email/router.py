from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi import Depends

from .service import (
    send_confirmation_email,
    send_email,
    send_welcome_email,
    send_reset_password_email,
)
from src.auth.dependencies import fastapi_users, get_jwt_strategy



router = APIRouter(prefix="/email", tags=["Email"])



class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ------------------------------
# Routes
# ------------------------------
@router.post("/test")
async def send_test_email(
    background_tasks: BackgroundTasks,
    email: EmailStr = "test@example.com",
):
    """Отправка тестового email"""
    background_tasks.add_task(
        send_email,
        [email],
        "Тестовое письмо от Auction API",
        "<h1>Тест MailHog</h1><p>Это тестовое письмо для проверки работы email рассылки</p>",
    )
    return {"message": "Test email sent to MailHog", "email": email}


@router.post("/welcome")
async def send_welcome_email_route(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    username: str,
):
    """Отправка приветственного письма"""
    background_tasks.add_task(send_welcome_email, email, username)
    return {"message": "Welcome email will be sent", "email": email}


from fastapi import Depends
from src.auth.dependencies import fastapi_users

@router.post("/forgot-password")
async def forgot_password(
    body: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    user_manager = Depends(fastapi_users.get_user_manager)  # <--- вот так
):
    """Отправка письма для восстановления пароля"""
    user = await user_manager.get_by_email(body.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    jwt_strategy = get_jwt_strategy()
    token = await jwt_strategy.write_token(user)
    background_tasks.add_task(send_reset_password_email, body.email, token)

    return {"message": "Password reset email sent"}



@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    user_manager = Depends(fastapi_users.get_user_manager)
):
    jwt_strategy = get_jwt_strategy()

    try:
        payload = await jwt_strategy.read_token(body.token)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user_id = int(payload.get("sub"))
    user = await user_manager.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = await user_manager.password_helper.hash(body.new_password)
    user.hashed_password = hashed_password
    await user_manager.update(user)

    return {"message": "Password successfully reset"}


@router.post("/confirm-account")
async def send_confirm_account_email(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    username: str,
    token: str,
):
    """Отправка письма для подтверждения аккаунта"""
    background_tasks.add_task(send_confirmation_email, email, username, token)
    return {"message": "Confirmation email will be sent", "email": email}
