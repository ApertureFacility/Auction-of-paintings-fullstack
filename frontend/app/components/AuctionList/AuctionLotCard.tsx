"use client";

import React from "react";
import styles from "./AuctionLotCard.module.css";
import { useModalStore } from "../../lib/modalStore";
import { AuctionLotCardProps } from "@/app/interfaces/ILot";





const AuctionLotCardSmall = ({ lot }: AuctionLotCardProps) => {
  const { open } = useModalStore();

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image_url) {
      open("image-zoom", { imageUrl: lot.image_url });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={lot.image_url}
          alt={lot.title}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.png";
          }}
        />
        <img
          src="/LupaCardIcon.png"
          alt="Zoom"
          className={styles.iconZoom}
          onClick={handleZoomClick}
        />
        <img
          src="/AddFavCard2.png"
          alt="Favorite"
          className={styles.iconStar}
        />
      </div>

      <div className={styles.authorRow}>
        <span className={styles.label}>АВТОР:</span>
        <span className={styles.author}>{lot.author}</span>
      </div>

      <h2 className={styles.title}>{lot.title}</h2>

      <div className={styles.authorWrapper}>
        <p className={styles.text}>Лот №{lot.id}</p>
      </div>

      <div className={styles.price_wrapper}>
        <img src="/dollar.svg" alt="Price icon" className={styles.icon} />
        <span className={styles.label}>СТОИМОСТЬ:</span>
        <span className={styles.price}>
          {typeof lot.current_price === "number"
            ? lot.current_price.toFixed(2)
            : lot.current_price}{" "}
          RUB
        </span>
      </div>
    </div>
  );
};

export default AuctionLotCardSmall;
