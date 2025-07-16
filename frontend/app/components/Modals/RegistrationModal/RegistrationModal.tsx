'use client'

import Input from "../../Inputs/Inputs"
import Button from "../../Button/Button"
import styles from "./RegModal.module.css"
import { useModalStore } from "../../../lib/modalStore"
import Checkbox from "../../CheckBox/Checkbox"

export default function RegistrationModal({
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
        <Input placeholder="ФИО (необязательно)" />
        <Input placeholder="E-mail адрес" type="email" />
        <Input placeholder="Телефон в формате +375(ХХ)-ХХХ-ХХ-ХХ" type="tel" />
        <Input placeholder="Введите пароль" type="password" />
        <Input placeholder="Подтверждение пароля" type="password" />
        <p className={styles.text}>
          Ваш логин формируется автоматически по названию электронной почты
        </p>
        <Checkbox label="Я прочитал и согласен с правилами использования персональных данных" />
        </div>
        <Button variant="primary" onClick={onClose}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  )
}
