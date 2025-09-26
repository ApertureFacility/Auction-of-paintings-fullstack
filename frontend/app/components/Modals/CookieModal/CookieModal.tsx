"use client";

import { useModalStore } from "@/app/lib/modalStore";
import styles from "./CookieModal.module.css";
import Button from "../../Button/Button";

export default function CookieModal() {
  const { openModal, close } = useModalStore();

  if (openModal !== "cookie") return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <p>Мы используем куки, чтобы улучшить ваш опыт на сайте.</p>
        </div>
        <div className={styles.acceptBtn}>
          <Button onClick={close}>Принять</Button>
        </div>
      </div>
    </div>
  );
}