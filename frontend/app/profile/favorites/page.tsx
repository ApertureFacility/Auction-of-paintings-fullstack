"use client";

import React, { useEffect, useState } from "react";
import styles from "../profile.module.css";

import { LotSmallCard } from "@/app/interfaces/ILot";
import { fetchSingleLot } from "../../apiRequests/lotsRequests";
import { fetchCurrentUser } from "../../apiRequests/userRequests";
import { useAuth } from "../../components/hooks/Auth";
import Loader from "@/app/components/Loader/Loader";
import AuctionLotCardSmall from "@/app/components/AuctionList/AuctionLotCard";

const FavoriteLotsGrid: React.FC = () => {
  const [favoriteLots, setFavoriteLots] = useState<LotSmallCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
          throw new Error("Требуется авторизация");
        }

        const userData = await fetchCurrentUser();

        if (!userData?.favorite_lots || userData.favorite_lots.length === 0) {
          return;
        }

        const lotsData = await Promise.all(
          userData.favorite_lots.map((id: { toString: () => string }) =>
            fetchSingleLot(id.toString()).catch(() => null)
          )
        );

        if (isMounted) {
          setFavoriteLots(lotsData.filter(Boolean) as LotSmallCard[]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>Требуется авторизация</div>
        <p>Пожалуйста, войдите в систему</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (favoriteLots.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p>У вас пока нет избранных лотов</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Избранные лоты</h1>
      <div className={styles.grid}>
        {favoriteLots.map((lot) => (
          <AuctionLotCardSmall
            key={lot.id}
            lot={lot}
            isFavorite={true}
            onRemoveFavorite={(id) =>
              setFavoriteLots((prev) => prev.filter((l) => l.id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteLotsGrid;
