"use client "
import { notFound } from "next/navigation";

import styles from "./lotsPage.module.css";
import { fetchSingleLot } from "@/app/apiRequests/lotsRequests";
import { LotCard } from "@/app/components/LotDetailPage/LotDetailPageSingleCard";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LotPage({ params }: PageProps) {
  const { id } = await params;  

  try {
    const lot = await fetchSingleLot(id);

    if (!lot) return notFound();

    return (
      <div className={styles.layout_container}>
        <LotCard lot={lot} />
      </div>
    );
  } catch {
    return <div>Ошибка загрузки лота</div>;
  }
}
