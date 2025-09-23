from fastapi import APIRouter, BackgroundTasks
from pydantic import EmailStr

from .service import (
    send_confirmation_email,
    send_email,
    send_welcome_email,
    send_reset_password_email 
)

router = APIRouter(prefix="/email", tags=["Email"])

@router.post("/test")
async def send_test_email(
    background_tasks: BackgroundTasks,
    email: EmailStr = "test@example.com"
):
    """Отправка тестового email"""
    background_tasks.add_task(
        send_email,
        [email],
        "Тестовое письмо от Auction API",
        "<h1>Тест MailHog</h1><p>Это тестовое письмо для проверки работы email рассылки</p>"
    )
    return {"message": "Test email sent to MailHog", "email": email}

@router.post("/welcome")
async def send_welcome_email_route(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    username: str
):
    """Отправка приветственного письма"""
    background_tasks.add_task(send_welcome_email, email, username)
    return {"message": "Welcome email will be sent", "email": email}

@router.post("/forgot-password")
async def send_forgot_password_email(
    background_tasks: BackgroundTasks,
    email: EmailStr
):
    """Отправка письма для восстановления пароля"""
    background_tasks.add_task(send_reset_password_email, email, token="dummy-token")
    return {"message": "Password reset email will be sent", "email": email}

@router.post("/confirm-account")
async def send_confirm_account_email(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    username: str,
    token: str
):
    """Отправка письма для подтверждения аккаунта"""
    background_tasks.add_task(send_confirmation_email, email, username, token)
    return {"message": "Confirmation email will be sent", "email": email}
