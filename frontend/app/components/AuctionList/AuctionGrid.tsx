import React, { useEffect, useState } from "react";
import styles from "./AuctionGrid.module.css";
import Pagination from "../Pagination/Pagination";
import { fetchLots, fetchLotsSearch } from "../../apiRequests/lotsRequests";
import { LotSmallCard } from "@/app/interfaces/ILot";
import AuctionLotCardSmall from "./AuctionLotCard";
import Loader from "../Loader/Loader";
import { useSearchParams, useRouter } from "next/navigation";

const LOTS_PER_PAGE = 6;

const AuctionGrid: React.FC = () => {
  const [lots, setLots] = useState<LotSmallCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const loadLots = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (searchQuery) {
          data = await fetchLotsSearch(searchQuery, currentPage, LOTS_PER_PAGE);
        } else {
          data = await fetchLots(currentPage, LOTS_PER_PAGE);
        }
        setLots(data.items);
        setTotalPages(Math.ceil(data.total / LOTS_PER_PAGE));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    loadLots();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className={styles.wrapper}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Актуальные лоты</h1>
      <div className={styles.grid}>
        {lots.map((lot) => (
          <AuctionLotCardSmall key={lot.id} lot={lot} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AuctionGrid;
