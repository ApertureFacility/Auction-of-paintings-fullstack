"use client";

import React from "react";
import styles from "./AuctionLotCard.module.css";
import { useModalStore } from "../../lib/modalStore";
import { AuctionLotCardProps } from "@/app/interfaces/ILot";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  removeLotFromFavorites,
  addLotToFavorites,
} from "@/app/apiRequests/userRequests";

const AuctionLotCardSmall = ({
  lot,
  onRemoveFavorite,
  isFavorite,
}: AuctionLotCardProps) => {
  const { open } = useModalStore();

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image_url) {
      open("image-zoom", { imageUrl: lot.image_url });
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFavorite && onRemoveFavorite) {
      try {
        await removeLotFromFavorites(lot.id.toString());
        toast.success("Лот удален из избранного");
        onRemoveFavorite(lot.id);
      } catch (err: any) {
        toast.error(err?.message || "Ошибка при удалении из избранного");
      }
      return;
    }

    try {
      await addLotToFavorites(lot.id);
      toast.success("Лот добавлен в избранное!");
    } catch (error: any) {
      const errorMessage =
        error?.message === "Lot already in favorites"
          ? "Лот уже в избранном"
          : error.message || "Ошибка при добавлении в избранное";

      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link href={`/lots/${lot.id}`} className={styles.cardLink}>
          <img
            src={lot.image_url}
            alt={lot.title}
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.png";
            }}
          />
        </Link>
        <img
          src="/LupaCardIcon.png"
          alt="Zoom"
          className={styles.iconZoom}
          onClick={handleZoomClick}
        />
        <img
          src={isFavorite ? "/bag.svg" : "/AddFavCard2.png"}
          alt="Favorite"
          className={styles.iconStar}
          onClick={handleFavoriteClick}
        />
      </div>

      <div className={styles.authorRow}>
        <span className={styles.label}>АВТОР:</span>
        <span className={styles.author}>{lot.author}</span>
      </div>

      <h2 className={styles.title}>{lot.title}</h2>

      <div className={styles.authorWrapper}>
        <p className={styles.text}>НОМЕР ЛОТА: {lot.id}</p>
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
