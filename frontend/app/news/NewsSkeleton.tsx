
import styles from "./NewsSkeleton.module.css";

const NewsSkeleton = () => {
  return (
    <div className={styles.newsItem}>
      <div className={styles.newsRow}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonTextBlock}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonDate}></div>
        </div>
      </div>
      <hr className={styles.separator} />
    </div>
  );
};

export default NewsSkeleton;
