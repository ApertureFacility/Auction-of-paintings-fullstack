"use client";
import AuctionGrid from "./components/AuctionList/AuctionGrid";
import FilterComponent from "./components/FilterSearchComponent/FilterComponent";
import HiglightNews from "./components/News/HiglightNews";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <span className={styles.headerText}>
        Тайна затерянных сокровищ самого известного императора ацтеков —
        Монтесумы
      </span>
      <img
        src="/HeaderPic2.png"
        alt="Header Background"
        className={styles.headerImage}
      />
      <section>
        <div className={styles.layout_container}>
          <AuctionGrid />
          <FilterComponent />
        </div>
        <div className={styles.margin_container}>
          <HiglightNews />
        </div>
      </section>
    </>
  );
}
