import { useState } from "react";
import Input from "../../Inputs/Inputs";
import Button from "../../Button/Button";
import styles from "./ForgotModal.module.css";

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
      const encodedEmail = encodeURIComponent(email);
      const url = `http://localhost:8000/email/forgot-password?email=${encodedEmail}`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Письмо для восстановления пароля отправлено!");
        setEmail("");
      } else {

        switch (res.status) {
          case 422:
            if (Array.isArray(data.detail)) {
              const errorMessages = data.detail.map((err: any) => {
                if (err.msg) return err.msg;
                if (err.message) return err.message;
                return "Ошибка валидации";
              });
              setError(errorMessages.join(", "));
            } else if (data.detail) {
              setError(typeof data.detail === 'string' 
                ? data.detail 
                : "Ошибка валидации данных");
            } else {
              setError("Неверный формат данных");
            }
            break;
          case 404:
            setError("Пользователь с таким email не найден");
            break;
          case 400:
            setError(data.detail || "Неверный запрос");
            break;
          default:
            setError(data.detail || "Ошибка при отправке письма");
        }
      }
    } catch (err) {
      setError("Ошибка сети. Проверьте подключение к интернету");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <div className={styles.backdrop}>
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