"use client";

import Input from "../../Inputs/Inputs";
import Button from "../../Button/Button";
import styles from "./AuthModal.module.css";
import { useModalStore } from "../../../lib/modalStore";
import { useState, useEffect } from "react";
import { loginUser } from "../../../apiRequests/userRequests";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../../lib/authStore"; 

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const openModal = useModalStore((state) => state.open);

  const { login } = useAuthStore(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !pathname.includes("/login")) {
      router.push(`${pathname}?modal=login`, { scroll: false });
    }
  }, [isOpen, pathname, router]);

  const handleClose = () => {
    router.back();
    onClose();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Не введены логин и(или) пароль");
      return;
    }

    try {
      setLoading(true);
      const { access_token } = await loginUser({ email, password });

      const success = await login(access_token);
      if (success) {
        handleClose();
      } else {
        setError("Ошибка авторизации");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.topBlock}>
          <h2 className={styles.title}>Авторизация</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <p className={styles.text}>
          Войдите в свою учетную запись, чтобы делать ставки и регистрироваться
          для участия в продажах.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <Input
          placeholder="Введите email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Input
          placeholder="Введите пароль"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <button
          className={styles.forgotPassword}
          onClick={() => openModal("forgot-password")}
        >
          Забыли пароль?
        </button>

        <Button variant="secondary" onClick={handleLogin} disabled={loading}>
          {loading ? "Загрузка..." : "Авторизироваться"}
        </Button>
        <Button onClick={() => openModal("registration")}>
          Создать новый аккаунт
        </Button>
      </div>
    </div>
  );
}
