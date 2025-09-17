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

const BID_STEP_PERCENT = 0.02;

export const LotCard: React.FC<{ lot: LotSingleDetailedCard }> = ({ lot }) => {
  const { open } = useModalStore();

  const [bids, setBids] = useState<Bid[]>([]);
  const [currentPrice, setCurrentPrice] = useState(lot.current_price || lot.start_price);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(lot.is_forced_started || false);

  const [lastBidTime, setLastBidTime] = useState<number | null>(null);
  const [timerPercent, setTimerPercent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const minNextBid = Math.ceil(currentPrice * (1 + BID_STEP_PERCENT));

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
    const wsHost = "localhost:8000";
    const ws = new WebSocket(`${wsProtocol}://${wsHost}/ws/lots/${lot.id}`);

    ws.onopen = () => {
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onclose = () => {
      setSocket(null);
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("[WS Error]", err);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "LOT_STATUS":
          setIsActive(data.is_active);
          setCurrentPrice(data.current_price);
          break;

        case "BID_HISTORY":
          setBids(data.bids);
          if (data.bids.length > 0) setCurrentPrice(data.bids[0].amount);
          break;

        case "NEW_BID":
          setBids(prev => [data.bid, ...prev]);
          setCurrentPrice(data.bid.amount);
          setLastBidTime(Date.now());
          break;

        case "USERS_COUNT":
          setUsersCount(data.count);
          break;

        case "AUCTION_ENDED":
          setAuctionEnded(true);
          setWinnerId(data.winner_id || null);
          setIsActive(false);
          setLastBidTime(null);
          setTimerPercent(0);
          if (timerRef.current) clearInterval(timerRef.current);

          if (data.winner_id === userId) {
            open("congratsBig");
          }
          break;

        case "ERROR":
          console.error("[WS ERROR]", data.message);
          break;

        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    setSocket(ws);
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [lot.id, userId, open]);

  // Таймер для последней ставки с отключением is_forced_started
  useEffect(() => {
    if (!lastBidTime || auctionEnded) return;

    setTimerPercent(100);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastBidTime;
      const percent = Math.max(0, 100 - (elapsed / 10000) * 100);
      setTimerPercent(percent);

      if (elapsed >= 10000) {
        clearInterval(timerRef.current!);
        timerRef.current = null;

        // Если лот был форсирован, закрываем его автоматически
        if (isActive && lot.is_forced_started) {
          setIsActive(false);
          // Сообщаем серверу о закрытии
          socket?.send(JSON.stringify({ type: "CLOSE_AUCTION" }));
        }
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lastBidTime, auctionEnded, socket, isActive, lot.is_forced_started]);

  useEffect(() => {
    setBidAmount(minNextBid.toString());
  }, [currentPrice]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isActive) {
      alert("Аукцион ещё не активен!");
      return;
    }

    if (auctionEnded) {
      alert("Аукцион завершён!");
      return;
    }

    if (!isConnected || !socket) {
      alert("Нет соединения с сервером");
      return;
    }

    if (!userId) {
      alert("Пользователь не авторизован");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minNextBid) {
      alert(`Минимальная ставка: ${formatPrice(minNextBid)} ₽`);
      return;
    }

    socket.send(JSON.stringify({
      type: "NEW_BID",
      user_id: userId,
      amount
    }));

    setBidAmount("");
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("ru-RU").format(price);

  const formatDate = (dateString?: string) => {
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

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image_url) open("image-zoom", { imageUrl: lot.image_url });
  };

  return (
    <article className={styles.card}>
      <div className={styles.leftColumn}>
        <section className={styles.priceSection}>
          <p className={styles.price}>Стартовая цена: {formatPrice(lot.start_price)} ₽</p>
          <p className={styles.time}>Стартует: {formatDate(lot.start_time)}</p>
          <p>Количество участников: {usersCount}</p>
        </section>

        <div className={styles.timerWrapper}>
          <TimerCircle timerPercent={timerPercent} currentPrice={currentPrice} formatPrice={formatPrice} />
        </div>

        <form onSubmit={handleBidSubmit} className={styles.bidForm}>
          <Input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Минимальная ставка ${formatPrice(minNextBid)} ₽`}
          />
          <Button variant="primary" disabled={!isActive || auctionEnded || !isConnected}>
            {auctionEnded ? "Аукцион завершён" : isActive ? "Сделать ставку" : "Ожидание начала"}
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
            <div className={styles.tableWrapper}>
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
                    <tr key={bid.id} className={index === 0 ? styles.newBidRow : ""}>
                      <td>{index + 1}</td>
                      <td>{bid.bidder_name}</td>
                      <td className={styles.bidAmount}>{formatPrice(bid.amount)} ₽</td>
                      <td>{formatDate(bid.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p>Ставок пока нет</p>}
        </section>
      </div>

      <div className={styles.rightColumn}>
        {lot.image_url && (
          <figure className={styles.imageContainer} onClick={handleZoomClick}>
            <img src={lot.image_url} alt={lot.title} className={styles.image} loading="lazy" />
          </figure>
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>{lot.title}</h1>
          <p className={styles.subtitle}>Автор: {lot.author || "Не указан"}</p>
        </div>

        <div className={styles.details}>
          <p className={styles.detailItem}><strong>Материалы:</strong> {lot.lot_materials}</p>
          <p className={styles.detailItem}><strong>Аукцион:</strong> {lot.auction_name}</p>
        </div>

        <section className={styles.description}>
          <h2 className={styles.descriptionTitle}>Описание лота</h2>
          <p className={styles.descriptionText}>{lot.description}</p>
        </section>
      </div>
    </article>
  );
};
