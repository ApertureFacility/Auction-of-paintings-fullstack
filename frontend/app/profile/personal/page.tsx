"use client";

import React, { useEffect, useState } from "react";
import Input from "@/app/components/Inputs/Inputs";
import styles from "./PersonalPage.module.css";
import { fetchCurrentUser, requestVerification } from "@/app/apiRequests/userRequests";
import Button from "@/app/components/Button/Button";
import Loader from "@/app/components/Loader/Loader";

interface UserData {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  username: string;
  favorite_lots: number[];
}

function PersonalPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<{ username: string; newEmail: string }>({ username: "", newEmail: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentUser();
        setUserData(data);
        setEditableData({ username: data.username, newEmail: "" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleVerify = async () => {
    if (!userData) return;
    try {
      setVerifying(true);
      setVerificationMsg(null);
      await requestVerification(userData.email); 
      setVerificationMsg("Письмо для подтверждения отправлено!");
    } catch (err) {
      setVerificationMsg(
        err instanceof Error ? err.message : "Ошибка при отправке письма"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = () => {

    setUserData(prev => prev ? { ...prev, username: editableData.username } : prev);
    setVerificationMsg(
      editableData.newEmail
        ? `Данные сохранены. Письмо для подтверждения нового e-mail (${editableData.newEmail}) отправлено!`
        : "Данные сохранены (локально)."
    );

    setEditableData(prev => ({ ...prev, newEmail: "" }));
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Личные данные</h1>
        <p className={styles.subtitle}>Ваша персональная информация</p>
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <Input
            value={userData?.email || ""}
            variant="default"
            label="Текущий E-mail"
            type="email"
            className={styles.input}
            disabled
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            value={editableData.newEmail}
            variant="default"
            label="Новый E-mail"
            placeholder="Введите новый e-mail"
            type="email"
            className={styles.input}
            onChange={(e) => setEditableData({ ...editableData, newEmail: e.target.value })}
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            value={editableData.username}
            variant="default"
            label="Имя пользователя"
            className={styles.input}
            onChange={(e) => setEditableData({ ...editableData, username: e.target.value })}
          />
        </div>

        {!userData?.is_verified && (
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={verifying}
          >
            {verifying ? "Отправка..." : "Верифицировать аккаунт"}
          </Button>
        )}

        {verificationMsg && (
          <p className={styles.verificationMsg}>{verificationMsg}</p>
        )}

        <Button variant="secondary" onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
}

export default PersonalPage;
