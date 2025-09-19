"use client";

import { useState, useEffect } from "react";
import { INews } from "../interfaces/INews";
import { fetchAllNews } from "../apiRequests/newsRequests";
import styles from "./NewsComponent.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import NewsSkeleton from "./NewsSkeleton";


const NewsComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;
  const skip = (page - 1) * limit;

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchAllNews(skip, limit);
        setNews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [skip]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }, [page, router]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    setPage(prev => prev + 1);
  };

  const handleClick = (id: number) => {
    router.push(`/news/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Новости</h1>

      <div className={styles.newsList}>
        {loading ? (
          [...Array(limit)].map((_, idx) => <NewsSkeleton key={idx} />)
        ) : error ? (
          <div className={`${styles.center} ${styles.error}`}>
            Ошибка: {error}
          </div>
        ) : news.length === 0 ? (
          <div className={styles.center}>Новостей не найдено</div>
        ) : (
          news.map(item => (
            <article
              key={item.id}
              className={styles.newsItem}
              onClick={() => handleClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.newsRow}>
                {item.image1_url && (
                  <img
                    src={item.image1_url}
                    alt={item.big_title}
                    className={styles.imageLeft}
                  />
                )}

                <div className={styles.textBlock}>
                  <h2 className={styles.bigTitle}>{item.big_title}</h2>
                  <p className={styles.bigText}>{item.big_text}</p>

                  <div className={styles.dateRow}>
                    <img
                      src="/calendarIcon.svg"
                      className={styles.calendarIco}
                      alt="Calendar"
                    />
                    <span className={styles.dateLabel}>Дата публикации:</span>
                    <span className={styles.dateValue}>
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <hr className={styles.separator} />
            </article>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={page === 1 ? styles.disabledBtn : styles.btn}
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          disabled={news.length < limit}
          className={news.length < limit ? styles.disabledBtn : styles.btn}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default NewsComponent;
