import Input from "../../Inputs/Inputs";
import Button from "../../Button/Button";
import styles from "./AuthModal.module.css";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
        <Input placeholder="Введите email" type="email" />
        <Input placeholder="Введите пароль" type="password" />
        <button className={styles.forgotPassword}>Забыли пароль?</button>
        <Button variant="secondary">Авторизироваться</Button>
        <Button>Создать новый аккаунт</Button>
      </div>
    </div>
  );
}
