"use client";

import { useState } from "react";

interface ResetPasswordClientProps {
  token?: string;
}

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      setError("Токен не найден.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка при смене пароля");
      }

      const data = await res.json();
      setMessage(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Сброс пароля</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="Новый пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        {loading ? "Сброс..." : "Сбросить пароль"}
      </button>
    </div>
  );
}
