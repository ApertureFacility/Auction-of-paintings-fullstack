import os
from pathlib import Path
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List


BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = BASE_DIR / "templates"

mail_config = ConnectionConfig(
    MAIL_USERNAME="",
    MAIL_PASSWORD="",
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@auctionapp.com"),
    MAIL_PORT=int(os.getenv("MAILHOG_PORT", 1025)),
    MAIL_SERVER=os.getenv("MAILHOG_HOST", "mailhog"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Auction App"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=False,
)

fm = FastMail(mail_config)

def load_template(name: str, **kwargs) -> str:
    """Загружает HTML-шаблон и подставляет значения переменных"""
    template_path = TEMPLATE_DIR / name
    if not template_path.exists():
        raise FileNotFoundError(f"Шаблон {name} не найден")

    content = template_path.read_text(encoding="utf-8")
    return content.format(**kwargs)

async def send_email(
    to: List[EmailStr],
    subject: str,
    body: str,
    subtype: str = "html"
):
    """Базовая функция отправки email"""
    message = MessageSchema(
        subject=subject,
        recipients=to,
        body=body,
        subtype=subtype,
    )
    await fm.send_message(message)


async def send_welcome_email(email: EmailStr, username: str):
    """Приветственное письмо после регистрации"""
    subject = f"Добро пожаловать в Auction App, {username}!"
    body = load_template("welcome.html", username=username, email=email)
    await send_email([email], subject, body)


async def send_confirmation_email(email: EmailStr, username: str, token: str):
    """Письмо для подтверждения аккаунта"""
    confirm_link = f"http://localhost:3000/confirm-account?token={token}"
    subject = f"Подтверждение аккаунта для {username}"
    body = load_template("confirm_account.html", username=username, confirm_link=confirm_link)
    await send_email([email], subject, body)


async def send_reset_password_email(email: EmailStr, reset_link: str):
    subject = "Восстановление пароля"
    body = load_template("reset_password.html", reset_link=reset_link)
    await fm.send_message(
        MessageSchema(subject=subject, recipients=[email], body=body, subtype="html")
    )