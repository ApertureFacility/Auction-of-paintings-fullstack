"use client";

import React from "react";
import styles from "../purchases/purchases.module.css";
import { useRouter } from "next/navigation";

const PurchasesPage: React.FC = () => {
    const router = useRouter();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Ваши покупки</h1>

      <div className={styles.emptyState}>
        <h2>Покупок пока нет</h2>
        <p>После выигрыша аукциона ваши лоты будут отображаться здесь.</p>
        <button onClick={() => router.push("/")}>
      Смотреть лоты
    </button>
      </div>
    </div>
  );
};

export default PurchasesPage;
