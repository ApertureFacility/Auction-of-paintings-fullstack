import styles from "./SoloNewsPage.module.css"
import { fetchNewsById } from "@/app/apiRequests/newsRequests";

interface NewsPageProps {
  params: { id: string };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const newsId = Number(params.id);
  const news = await fetchNewsById(newsId);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{news.big_title}</h1>
      
      <div className={styles.dateRow}>
        <img src="/calendarIcon.svg" className={styles.calendarIco} alt="Calendar" />
        <span className={styles.dateLabel}>Дата публикации:</span>
        <span className={styles.dateValue}>
          {new Date(news.published_at).toLocaleDateString()}
        </span>
      </div>

      {news.image1_url && (
        <div className={styles.heroImageWrap}>
          <img
            src={news.image1_url}
            alt={news.big_title}
            width={1200}
            height={630}
            className={styles.heroImage}
          />
        </div>
      )}

      <p className={styles.bigText}>{news.big_text}</p>

      {(news.image2_url || news.small_title || news.small_text) && (
        <section className={styles.extraBlock}>
          {news.image2_url && (
            <div className={styles.extraImageWrap}>
              <img
                src={news.image2_url}
                alt={news.small_title || news.big_title}
                width={900}
                height={500}
                className={styles.extraImage}
              />
            </div>
          )}
          {news.small_title && <h2 className={styles.subTitle}>{news.small_title}</h2>}
          {news.small_text && <p className={styles.smallText}>{news.small_text}</p>}
        </section>
      )}
    </div>
  );
}
