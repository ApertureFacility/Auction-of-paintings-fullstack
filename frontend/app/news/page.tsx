import { Suspense } from "react";
import NewsContent from "./NewsContent";
import styles from "./NewsComponent.module.css";

export default function NewsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Новости</h1>
      <Suspense fallback={<div className={styles.center}>Загрузка новостей...</div>}>
        <NewsContent />
      </Suspense>
    </div>
  );
}