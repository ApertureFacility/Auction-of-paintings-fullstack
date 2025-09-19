import React from 'react';
import Image from 'next/image';
import styles from './aboutPage.module.css';

function AboutUsPage() {
  return (
    <div className={styles.aboutPageWrapper}>
      <div className={styles.aboutPageTopBlock}>
        <div className={styles.topBlockText}>
          <h1>О нас</h1>
          <p>Auction.com — пространство, где искусство встречается с сообществом, а творчество становится образом жизни.</p>
        </div>
        <div className={styles.topBlockImage}>
          <Image 
            src="/aboutUs.jpeg" 
            alt="Art Center interior" 
            width={600} 
            height={400}
            priority
          />
        </div>
      </div>

      <div className={styles.aboutPageMiddleBlock}>
        <div className={styles.missionContent}>
          <h2>Наша миссия</h2>
          <p>Мы создаем вдохновляющую среду для художников и ценителей искусства, предоставляя площадку для выставок, мастер-классов и творческого обмена. Наша цель — сделать искусство доступным и понятным для всех.</p>
          
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>лет работы</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>выставок</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>200+</span>
              <span className={styles.statLabel}>художников</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5000+</span>
              <span className={styles.statLabel}>гостей ежегодно</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.aboutPageBottomBlock}>
        <h2>Наша команда</h2>
        <p>Профессионалы с многолетним опытом в мире искусства, кураторства и образования</p>
      <div className={styles.valuesSection}>
        <h2>Наши ценности</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🎨</div>
            <h3>Творчество</h3>
            <p>Поощряем эксперименты и инновации в искусстве</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🤝</div>
            <h3>Сообщество</h3>
            <p>Создаем пространство для диалога между художниками и зрителями</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🌍</div>
            <h3>Доступность</h3>
            <p>Делаем искусство открытым для всех социальных групп</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🔍</div>
            <h3>Образование</h3>
            <p>Помогаем понять и полюбить современное искусство</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AboutUsPage;