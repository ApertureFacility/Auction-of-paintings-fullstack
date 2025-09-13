"use client"

import Button from "../../Button/Button"
import styles from "./CongtatsBig.module.css"

interface CongratsBigModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CongratsBigModal({ isOpen, onClose }: CongratsBigModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.topBlock}>
          <h2 className={styles.title}>Поздравляем</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <p>Вы выиграли лот</p>
        <p>13123123132</p>
        <img
          src="/CongratsBigPic.png"
          alt="CongratsPic"
          className={styles.GratsIcon}
        />
        <p>Ваш выигрыш уже в корзине</p>
        <Button variant="primary">Открыть корзину</Button>
      </div>
    </div>
  )
}
