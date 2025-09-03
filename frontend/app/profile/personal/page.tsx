"use client"

import React, { useEffect, useState } from 'react';
import Input from '@/app/components/Inputs/Inputs';
import styles from './PersonalPage.module.css';
import { fetchCurrentUser } from '@/app/apiRequests/userRequests';
import Button from '@/app/components/Button/Button';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentUser();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Ошибка: {error}
        </div>
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
            value={userData?.email || ''}
            variant='default' 
            label='E-mail адрес'
            placeholder='Укажите e-mail адрес'
            type='email'
            className={styles.input}
            disabled 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <Input 
            value={userData?.is_verified ? 'Верифицирован' : 'Не верифицирован'}
            variant='default' 
            label='Статус верификации'
            className={styles.input}
            disabled 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <Input 
            value={userData?.username || ''}
            variant='default' 
            label='Имя пользователя'
            className={styles.input}
            disabled 
          />
        </div>
        <Button variant='secondary'>Сохранить</Button>
      </div>
    </div>
  );
}

export default PersonalPage;