'use client'

import Input from "../../Inputs/Inputs"
import Button from "../../Button/Button"
import styles from "../MailSendsModal/ModalSendsModal.module.css"
import { useModalStore } from "../../../lib/modalStore" 

export default function MailSendsModal({
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
          <h2 className={styles.title}>Письмо отправлено</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <p className={styles.text}>
        На указанный Вами электронный адрес отправленно письмо с инструкцией по восстановлению пароля.
        </p>
        <Button variant="primary"onClick={onClose}>Хорошо</Button>
      </div>
    </div>
  )
}
