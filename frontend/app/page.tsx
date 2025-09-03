"use client";

import { Suspense } from "react";
import AuctionGrid from "./components/AuctionList/AuctionGrid";
import FilterComponent from "./components/FilterSearchComponent/FilterComponent";
import HiglightNews from "./components/News/HiglightNews";
import styles from "./page.module.css";
import Loader from "./components/Loader/Loader";

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
          <Suspense fallback={<div><Loader /></div>}>
            <AuctionGrid />
          </Suspense>
          <Suspense fallback={<div><Loader /></div>}>
            <FilterComponent />
          </Suspense>
        </div>
        <div className={styles.margin_container}>
          <Suspense fallback={<div><Loader /></div>}>
            <HiglightNews />
          </Suspense>
        </div>
      </section>
    </>
  );
}