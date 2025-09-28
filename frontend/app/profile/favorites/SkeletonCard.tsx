import React from "react";
import styles from "./SkeletonCard.module.css";

const SkeletonCard: React.FC = () => {
  return (
    <div className={styles.wrapp}>
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.image} />
      </div>

      <div className={styles.authorRow}>
        <div className={styles.label} />
        <div className={styles.author} />
      </div>

      <div className={styles.title} />
      <div className={styles.text} />

      <div className={styles.price_wrapper}>
        <div className={styles.icon} />
        <div className={styles.price} />
      </div>
    </div>
    </div>
  );
};

export default SkeletonCard;
