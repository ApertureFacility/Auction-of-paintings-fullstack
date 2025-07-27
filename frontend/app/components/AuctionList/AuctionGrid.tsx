import React from "react";
import AuctionLotCard from "./AuctionLotCard";
import styles from "./AuctionGrid.module.css";
import Pagination from "../Pagination/Pagination";

const mockLots = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  image: `/img${i + 1}.png`,
  title: `Лот имя ${i + 1}`,
  author: `Автор ${i + 1}`,
  lotNumber: 100 + i + 1,
  price: `${(Math.random() * 50000 + 10000).toFixed(0)}`,
}));

const AuctionGrid: React.FC = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>Актуальные лоты</h1>
        <div className={styles.grid}>
          {mockLots.map((lot) => (
            <AuctionLotCard key={lot.id} lot={lot} />
          ))}
        </div>
        <Pagination />
      </div>
    </>
  );
};

export default AuctionGrid;
