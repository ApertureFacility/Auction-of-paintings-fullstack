import Input from "../../Inputs/Inputs";
import Button from "../../Button/Button";
import styles from "./ForgotModal.module.css";

export default function ForgotPassModal({
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
          <h2 className={styles.title}>Забыли пароль</h2>
          <img
            src="/CloseCross.svg"
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>
        <p className={styles.text}>
          Пожалуйста, укажите Ваш E-mail адрес для восстановления пароля.
        </p>
        <div className={styles.inputWrapp}>
          <Input
            placeholder="Введите email"
            type="email"
          />
        </div>
        <Button>Продолжить</Button>
      </div>
    </div>
  );
}
