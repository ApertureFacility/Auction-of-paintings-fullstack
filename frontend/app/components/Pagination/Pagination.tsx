import React, { useState } from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages = 3,
  initialPage = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.arrowButton} ${
          currentPage === 1 ? styles.disabled : ""
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <img src="/arrow-left.svg" alt="Назад" />
        <span>НАЗАД</span>
      </button>

      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              className={`${styles.pageButton} ${
                page === currentPage ? styles.active : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.arrowButton} ${
          currentPage === totalPages ? styles.disabled : ""
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <span>ВПЕРЕД</span>
        <img src="/arrow-right.svg" alt="Вперёд" />
      </button>
    </div>
  );
};

export default Pagination;
