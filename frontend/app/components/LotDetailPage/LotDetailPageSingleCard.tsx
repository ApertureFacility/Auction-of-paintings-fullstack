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

  const [lastBidTime, setLastBidTime] = useState<number | null>(null);
  const [timerPercent, setTimerPercent] = useState(0);
  const timerRef = useRef<number | null>(null);

  const minNextBid = Math.ceil(currentPrice * (1 + BID_STEP_PERCENT));

  // Загружаем текущего пользователя
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


  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsHost = window.location.host; 
    const ws = new WebSocket(`${wsProtocol}://${wsHost.replace("3000", "8000")}/ws/lots/${lot.id}`);
    
    ws.onopen = () => {
      console.log("WebSocket соединение установлено");
      setSocket(ws);
      setIsConnected(true);


      ws.send(
        JSON.stringify({
          type: "GET_HISTORY",
          lot_id: lot.id,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      if (Array.isArray(data)) {
        setBids(data);
        if (data.length > 0) {
          setCurrentPrice(data[0].amount);
        }
        return;
      }
    
      if (data.type === "NEW_BID" && data.bid) {
        const newBid: Bid = {
          id: data.bid.id,
          amount: data.bid.amount,
          bidder_name: data.bid.bidder_name,
          created_at: data.bid.created_at,
        };
        setBids((prev) => [newBid, ...prev]);
        setCurrentPrice(data.bid.amount);
        return;
      }
    
      if (data.type === "USERS_COUNT") {
        setUsersCount(data.count);
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
      ) {
        ws.close();
      }
    };
  }, [lot.id]);


  useEffect(() => {
    if (bids.length > 0) {
      setLastBidTime(Date.now());
    }
  }, [bids]);

  useEffect(() => {
    if (!lastBidTime) {
      setTimerPercent(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setTimerPercent(100);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [lastBidTime]);

  useEffect(() => {
    setBidAmount(minNextBid.toString());
  }, [currentPrice]);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  }, [bids]);

  const onTimerComplete = () => {
    alert("Аукцион завершён! Лот достается последнему победителю.");
  };

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lot.image_url) {
      open("image-zoom", { imageUrl: lot.image_url });
    }
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        user_id: userId,
        amount: amount,
      })
    );

    setBidAmount("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

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

          <Button variant="primary" disabled={!isConnected}>
            {isConnected ? "Сделать ставку" : "Подключение..."}
          </Button>
          {!isConnected && (
            <p className={styles.connectionWarning}>
              Нет соединения с сервером ставок
            </p>
          )}
        </form>

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
