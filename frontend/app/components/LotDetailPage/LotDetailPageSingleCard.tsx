"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./LotDetailPageSingleCard.module.css";
import Button from "../Button/Button";
import Input from "../Inputs/Inputs";
import { useModalStore } from "../../lib/modalStore";
import { LotSingleDetailedCard } from "@/app/interfaces/ILot";
import { fetchCurrentUser } from "@/app/apiRequests/userRequests";
import TimerCircle from "./TimeCircle";

interface Bid {
  id: string;
  amount: number;
  bidder_name: string;
  created_at: string;
}

const BID_TIME_LIMIT = 10000;
const BID_STEP_PERCENT = 0.02;

export const LotCard: React.FC<{ lot: LotSingleDetailedCard }> = ({ lot }) => {
  const { open } = useModalStore();
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentPrice, setCurrentPrice] = useState(
    lot.current_price || lot.start_price
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);

  const [lastBidTime, setLastBidTime] = useState<number | null>(null);
  const [timerPercent, setTimerPercent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const minNextBid = Math.ceil(currentPrice * (1 + BID_STEP_PERCENT));
  const canBid = React.useMemo(() => !auctionEnded, [auctionEnded]);

  // Загружаем пользователя
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Не удалось загрузить пользователя:", error);
      }
    }
    loadUser();
  }, []);

  // Подключение к WebSocket
  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsHost = window.location.host;
    const ws = new WebSocket(
      `${wsProtocol}://${wsHost.replace("3000", "8000")}/ws/lots/${lot.id}`
    );

    ws.onopen = () => {
      console.log("WebSocket соединение установлено");
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        setBids(data);
        if (data.length > 0) setCurrentPrice(data[0].amount);
        return;
      }

      switch (data.type) {
        case "NEW_BID":
          if (data.bid) {
            const newBid: Bid = {
              id: data.bid.id,
              amount: data.bid.amount,
              bidder_name: data.bid.bidder_name,
              created_at: data.bid.created_at,
            };
            setBids((prev) => [newBid, ...prev]);
            setCurrentPrice(data.bid.amount);
          }
          break;

        case "BID_HISTORY":
          if (Array.isArray(data.bids)) {
            const mappedBids: Bid[] = data.bids.map((b: any) => ({
              id: b.id,
              amount: b.amount,
              bidder_name: b.bidder_name,
              created_at: b.created_at,
            }));
            setBids(mappedBids);
            if (mappedBids.length > 0) setCurrentPrice(mappedBids[0].amount);
          }
          break;

        case "USERS_COUNT":
          setUsersCount(data.count);
          break;

        case "AUCTION_ENDED":
          setAuctionEnded(true);
          setWinnerId(data.winner_id || null);
          setLastBidTime(null);
          setTimerPercent(0);
          if (timerRef.current) clearInterval(timerRef.current);

          if (data.winner_id === userId) {
            useModalStore.getState().open("congratsBig"); // только серверная победа
          }
          break;

        case "LOT_STATUS":
          setAuctionEnded(!data.is_active);
          setCurrentPrice(data.current_price);

          if (!data.is_active) {
            setLastBidTime(null);
            setTimerPercent(0);
            if (timerRef.current) clearInterval(timerRef.current);
          }
          break;

        case "AUCTION_NOT_STARTED":
          alert(
            `Аукцион ещё не начался. Старт: ${formatDate(data.start_time)}`
          );
          break;

        case "ERROR":
          alert(data.message);
          break;

        default:
          console.warn("Unknown message type:", data.type);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket соединение закрыто");
      setIsConnected(false);
      setSocket(null);
    };

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      )
        ws.close();
    };
  }, [lot.id, userId]);

  // Таймер на новые ставки
  useEffect(() => {
    if (auctionEnded) {
      setTimerPercent(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (bids.length === 0) return;

    // Новая ставка считается свежей, если была создана в последние 2 сек
    const lastBid = bids[0];
    const bidTime = new Date(lastBid.created_at).getTime();
    const now = Date.now();
    if (now - bidTime < 2000) {
      setLastBidTime(now);
    }
  }, [bids, auctionEnded]);

  useEffect(() => {
    if (!lastBidTime || auctionEnded) {
      setTimerPercent(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimerPercent(100);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastBidTime;
      const percent = Math.max(0, 100 - (elapsed / BID_TIME_LIMIT) * 100);
      setTimerPercent(percent);

      if (elapsed >= BID_TIME_LIMIT) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        onTimerComplete();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lastBidTime, auctionEnded]);

  useEffect(() => {
    setBidAmount(minNextBid.toString());
  }, [currentPrice]);

  const tableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = 0;
  }, [bids]);

  const onTimerComplete = async () => {
    if (!lot.id || auctionEnded) return;

    try {
      const wsMessage = { type: "CLOSE_AUCTION", lot_id: lot.id };
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(wsMessage));
      }

      await fetch(`http://localhost:8000/lots/${lot.id}/finish`, {
        method: "POST",
        credentials: "include",
      });

      setAuctionEnded(true);
    } catch (error) {
      console.error("Не удалось завершить аукцион:", error);
    }
  };

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image_url) open("image-zoom", { imageUrl: lot.image_url });
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (auctionEnded) {
      // <-- новая проверка
      alert("Аукцион уже завершён!");
      return;
    }

    if (!canBid) {
      alert("Аукцион ещё не начался!");
      return;
    }

    if (!isConnected || !socket) {
      alert("Соединение с сервером не установлено");
      return;
    }

    if (!userId) {
      alert("Пользователь не авторизован");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      alert("Введите корректную сумму");
      return;
    }

    if (amount < minNextBid) {
      alert(`Минимальная ставка: ${formatPrice(minNextBid)} ₽`);
      return;
    }

    socket.send(
      JSON.stringify({
        type: "NEW_BID",
        user_id: userId,
        amount,
      })
    );

    setBidAmount("");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Не указано";
    try {
      return new Date(dateString).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Неверный формат даты";
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.leftColumn}>
        <section className={styles.priceSection}>
          <p className={styles.price}>
            Стартовая цена: {formatPrice(lot.start_price)} ₽
          </p>
          <p className={styles.time}>Стартует: {formatDate(lot.start_time)}</p>
          <p>Количество участников: {usersCount}</p>
        </section>

        <div className={styles.timerWrapper}>
          <TimerCircle
            timerPercent={timerPercent}
            currentPrice={currentPrice}
            formatPrice={formatPrice}
          />
        </div>

        <form onSubmit={handleBidSubmit} className={styles.bidForm}>
          <Input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Минимальная ставка ${formatPrice(minNextBid)} ₽`}
          />
          <Button
            variant="primary"
            disabled={!isConnected || !canBid || auctionEnded}
          >
            {auctionEnded
              ? "Аукцион завершён"
              : canBid
              ? "Сделать ставку"
              : "Ожидание начала"}
          </Button>
        </form>

        {auctionEnded && (
          <div className={styles.auctionResult}>
            {winnerId
              ? winnerId === userId
                ? "Поздравляем! Вы победили 🎉"
                : `Аукцион завершён. Победитель — пользователь ${winnerId}`
              : "Аукцион завершён без победителя"}
          </div>
        )}

        <section className={styles.bidsSection}>
          <h3>История ставок</h3>
          {bids.length > 0 ? (
            <div className={styles.tableWrapper} ref={tableRef}>
              <table className={styles.bidsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Участник</th>
                    <th>Ставка</th>
                    <th>Время</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.slice(0, 15).map((bid, index) => (
                    <tr
                      key={bid.id}
                      className={index === 0 ? styles.newBidRow : ""}
                    >
                      <td>{index + 1}</td>
                      <td>{bid.bidder_name}</td>
                      <td className={styles.bidAmount}>
                        {formatPrice(bid.amount)} ₽
                      </td>
                      <td>{formatDate(bid.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Ставок пока нет</p>
          )}
        </section>
      </div>

      <div className={styles.rightColumn}>
        {lot.image_url && (
          <figure className={styles.imageContainer} onClick={handleZoomClick}>
            <img
              src={lot.image_url}
              alt={lot.title}
              className={styles.image}
              loading="lazy"
            />
          </figure>
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>{lot.title}</h1>
          <p className={styles.subtitle}>Автор: {lot.author || "Не указан"}</p>
        </div>

        <div className={styles.details}>
          <p className={styles.detailItem}>
            <strong>Материалы:</strong> {lot.lot_materials}
          </p>
          <p className={styles.detailItem}>
            <strong>Аукцион:</strong> {lot.auction_name}
          </p>
        </div>

        <section className={styles.description}>
          <h2 className={styles.descriptionTitle}>Описание лота</h2>
          <p className={styles.descriptionText}>{lot.description}</p>
        </section>
      </div>
    </article>
  );
};
