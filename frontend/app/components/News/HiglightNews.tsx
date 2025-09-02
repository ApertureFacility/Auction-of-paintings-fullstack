import React, { useEffect, useState } from "react";
import styles from "./HiglightNews.module.css";
import Button from "../Button/Button";
import { INews } from "../../interfaces/INews";
import Link from "next/link";
import { fetchLatestNews } from "@/app/apiRequests/newsRequests";

function HiglightNews() {
  const [latestNews, setLatestNews] = useState<INews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const news = await fetchLatestNews();
        setLatestNews(news);
      } catch (err) {
        setError("Не удалось загрузить новости");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!latestNews) {
    return <p>Нет новостей</p>;
  }

  return (
    <div className={styles.newsWrapper}>
      <div className={styles.newsWrapper__desktop}>
        <img
          src={latestNews.image1_url || "/fallback.png"}
          alt="NewsPicture"
          className={styles.newsPicture_icon}
        />
        <div className={styles.TextWrapper}>
          <p className={styles.news_title}>
            <img src="/fileIcon.svg" alt="NewsPicture" /> {latestNews.big_title}
          </p>
          <p className={styles.news_text}>{latestNews.big_text}</p>
          <Link href={`/news/${latestNews.id}`} passHref>
            <Button variant="secondary">Ознакомиться</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HiglightNews;
