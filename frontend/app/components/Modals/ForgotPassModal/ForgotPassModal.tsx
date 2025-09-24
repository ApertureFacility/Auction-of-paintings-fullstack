import { useState, useEffect } from "react";
import Input from "../../Inputs/Inputs";
import Button from "../../Button/Button";
import styles from "./ForgotModal.module.css";
import { forgotPassword } from "@/app/apiRequests/userRequests";


export default function ForgotPassModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Пожалуйста, введите email");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await forgotPassword(email);
      setMessage("Письмо для восстановления пароля отправлено!");
      console.log("Reset token:", data.token);
      setEmail("");
    } catch (err: any) {
      switch (err.status) {
        case 404:
          setError("Пользователь с таким email не найден");
          break;
        case 422:
          setError("Ошибка валидации данных");
          break;
        case 400:
          setError(err.detail || "Неверный запрос");
          break;
        default:
          setError(err.detail || "Ошибка при отправке письма");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (message) setMessage("");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.topBlock}>
          <h2 className={styles.title}>Забыли пароль</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <p className={styles.text}>
          Пожалуйста, укажите Ваш E-mail адрес для восстановления пароля.
        </p>
        <div className={styles.inputWrapp}>
          <Input
            placeholder="Введите email"
            type="email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Отправка..." : "Продолжить"}
        </Button>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
