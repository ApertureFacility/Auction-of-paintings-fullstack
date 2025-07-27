'use client'

import { useState } from "react"
import Input from "../../Inputs/Inputs"
import Button from "../../Button/Button"
import styles from "./RegModal.module.css"
import Checkbox from "../../CheckBox/Checkbox"
import { registerUser } from "../../requests/Auth"

export default function RegistrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
 

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleRegister = async () => {
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("Заполните все поля")
      return
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (!agree) {
      setError("Необходимо согласиться с правилами")
      return
    }

    setLoading(true)

    try {
      await registerUser({
        email,
        password,
        username: email.split("@")[0],
        is_active: true,
        is_superuser: false,
        is_verified: false,
      })

      onClose()
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.topBlock}>
          <h2 className={styles.title}>Регистрация аккаунта</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.text}>
            Заполните поля для регистрации нового аккаунта в системе.
          </p>
          <Input
            placeholder="E-mail адрес"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Подтверждение пароля"
            type="password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />
          <p className={styles.text}>
            Ваш логин формируется автоматически по названию электронной почты
          </p>
          <Checkbox
            label="Я прочитал и согласен с правилами использования персональных данных"
            checked={agree}
            onChange={(e: any) => setAgree(e.target.checked)}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <Button variant="primary" onClick={handleRegister} disabled={loading}>
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </Button>
      </div>
    </div>
  )
}
