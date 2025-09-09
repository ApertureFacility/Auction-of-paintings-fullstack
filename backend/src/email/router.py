from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import EmailStr
from typing import List

from .service import send_email, send_welcome_email, send_bid_notification_email, send_auction_ended_email

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


@router.post("/auction-ended")
async def send_auction_ended(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    lot_name: str,
    winning: bool = False
):
    """Уведомление о завершении аукциона"""
    background_tasks.add_task(send_auction_ended_email, email, lot_name, winning)
    return {"message": "Auction ended notification email will be sent"}
@router.post("/forgot-password")
async def send_forgot_password_email(
    background_tasks: BackgroundTasks,
    email: EmailStr
):
    """Отправка письма для восстановления пароля"""
    reset_link = f"http://localhost:3000/reset-password?email={email}" 
    subject = "Восстановление пароля в Auction App"
    body = f"""
    <h1>Восстановление пароля</h1>
    <p>Чтобы восстановить пароль, перейдите по ссылке:</p>
    <a href="{reset_link}">Сбросить пароль</a>
    <br>
    <p>Если вы не запрашивали восстановление, просто проигнорируйте это письмо.</p>
    """

    background_tasks.add_task(send_email, [email], subject, body)
    return {"message": "Password reset email will be sent", "email": email}
