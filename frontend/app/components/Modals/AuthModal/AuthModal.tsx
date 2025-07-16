'use client'

import Input from "../../Inputs/Inputs"
import Button from "../../Button/Button"
import styles from "./AuthModal.module.css"
import { useModalStore } from "../../../lib/modalStore" 

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const openModal = useModalStore((state) => state.open) 

  if (!isOpen) return null

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
        <Input placeholder="Введите email" type="email" />
        <Input placeholder="Введите пароль" type="password" />
        
        <button
          className={styles.forgotPassword}
          onClick={() => openModal('forgot-password')}
        >
          Забыли пароль?
        </button>

        <Button variant="secondary">Авторизироваться</Button>
        <Button onClick={() => openModal('registration')}>Создать новый аккаунт</Button>
      </div>
    </div>
  )
}
