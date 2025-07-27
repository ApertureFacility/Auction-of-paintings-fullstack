"use client";

import React from "react";
import styles from "./AuctionLotCard.module.css";
import { useModalStore } from "../../lib/modalStore";

interface Lot {
  id: number;
  image: string;
  title: string;
  author: string;
  lotNumber: number;
  price: string;
}

interface Props {
  lot: Lot;
}

const AuctionLotCard: React.FC<Props> = ({ lot }) => {
  const { open } = useModalStore();

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image) {
      open("image-zoom", { imageUrl: lot.image });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={lot.image} alt={lot.title} className={styles.image} />

        <img
          src="/LupaCardIcon.png"
          alt="zoom"
          className={styles.iconZoom}
          onClick={handleZoomClick}
        />

        <img
          src="/AddFavCard2.png"
          alt="favorite"
          className={styles.iconStar}
        />
      </div>

      <div className={styles.authorRow}>
        <span className={styles.label}>АВТОР:</span>
        <span className={styles.author}>{lot.author.toUpperCase()}</span>
      </div>

      <h2 className={styles.title}>{lot.title}</h2>
      <div className={styles.authorWrapper}>
        <p className={styles.text}>Лот №{lot.lotNumber}</p>
      </div>

      <div className={styles.price_wrapper}>
        <img src="/dollar.svg" alt="price_icon" className={styles.icon} />
        <span className={styles.label}>СТОИМОСТЬ:</span>
        <span className={styles.price}>{lot.price.toUpperCase()} RUB</span>
      </div>
    </div>
  );
};

export default AuctionLotCard;
