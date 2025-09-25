"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./ResetPasswordPage.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) return <p className={styles.error}>Некорректная ссылка</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8000/email/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Пароль успешно изменён! Перенаправление на главную страницу");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMessage(data.detail || "Ошибка при сбросе пароля.");
      }
    } catch {
      setMessage("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h1 className={styles.title}>Новый пароль</h1>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Сохранение..." : "Сохранить пароль"}
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
}
