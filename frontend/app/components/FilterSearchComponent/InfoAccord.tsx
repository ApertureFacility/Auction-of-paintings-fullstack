import React, { useState } from "react";
import styles from "./InfoAccord.module.css";
import Button from "../Button/Button";

function AuctionInfoSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordion_toggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.accordion_toggle_content}>
          Информация
        </span>
        <img
          src="/downIcon.svg"
          alt="Стрелка вниз"
          className={`${styles.filter__icon} ${isOpen ? styles.rotated : ''}`}
        />
      </button>

      <div
        className={`${styles.accordion_content} ${isOpen ? styles.open : ''}`}
      >
          <div className={styles.filter__auc_wrapper}>
            <img
              src="/calendarIcon.svg"
              alt="Телефон"
              className={styles.filter__icon}
            />
            Дата аукциона
            <p className={styles.filter__date_text}>10 – 13 Января</p>
          </div>

          <h5 className={styles.filter__heading}>Утро продаж</h5>
          <p className={styles.filter__text_heading}>10-11 Января 6:00</p>
          <p className={styles.filter__text_heading}>Лоты (1-24)</p>

          <h5 className={styles.filter__heading}>Вечер продаж</h5>
          <p className={styles.filter__text_heading}>13 Января 18:00</p>
          <p className={styles.filter__text_heading}>Лоты (25-31)</p>
          <h3 className={styles.filter__section_title}>Регистрация открыта</h3>
          <p className={styles.filter__text_reg}>
            Зарегистрируйтесь сейчас, чтобы делать предварительные ставки или
            делать ставки в реальном времени в нашем цифровом зале продаж.
          </p>

          <Button variant="secondary">Зарегестрироваться</Button>

          <div className={styles.filter__contacts_wrapper}>
            <h5 className={styles.filter__heading}>Контакты со специалистом</h5>
            <p className={styles.filter__text}>
              <img
                src="/phoneIcon.svg"
                alt="Телефон"
                className={styles.filter__icon}
              />
              +44 20 7318 4024
            </p>
            <p className={styles.filter__text}>
              <img
                src="/mailIcon.svg"
                alt="Почта"
                className={styles.filter__icon}
              />
              EditionsLondon@Phillips.com
            </p>

            <h5 className={styles.filter__heading}>Rebecca Tooby</h5>
            <p className={styles.filter__text}>
              DesmondSpecialist, Head of Sale, Editionsrtooby
            </p>
            <p className={styles.filter__text}>
              <img
                src="/mailIcon.svg"
                alt="Почта"
                className={styles.filter__icon}
              />
              desmond@phillips.com
            </p>

            <h5 className={styles.filter__heading}>Robert Kennan</h5>
            <p className={styles.filter__text}>Head of Editions, Europe</p>
            <p className={styles.filter__text}>
              <img
                src="/mailIcon.svg"
                alt="Почта"
                className={styles.filter__icon}
              />
              rkennan@phillips.com
            </p>
          </div>
        </div>
      
    </div>
  );
}

export default AuctionInfoSection;
