import React from "react";
import styles from "./HiglightNews.module.css";
import Button from "../Button/Button";

function HiglightNews() {
  return (
    <div className={styles.newsWrapper}>
      <div className={styles.newsWrapper__desktop}>
        <img
          src="/img1.png"
          alt="NewsPicture"
          className={styles.newsPicture_icon}
        />
        <div className={styles.TextWrapper}>
          <p className={styles.news_title}>
            <img src="/fileIcon.svg" alt="NewsPicture" /> Статья
          </p>
          <p className={styles.news_text}>
            «В нашей жизни есть один цвет, как на палитре художника, который
            дает смысл жизни и искусства. Это цвет любви» —Марк Шагал
          </p>
          <Button variant="secondary">Ознакомиться</Button>
        </div>
      </div>
    </div>
  );
}

export default HiglightNews;
