"use client"


import styles from "./page.module.css";
import Button from "./components/Button/Button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <Button onClick={() => console.log('Primary clicked')}>
    Черная кнопка
</Button>

<Button variant="secondary" onClick={() => console.log('Secondary clicked')}>
    Белая кнопка с обводкой
</Button>
</main>
    </div>
  );
}
