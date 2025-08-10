import React, { useState, useEffect } from "react";
import styles from "./FilterComponent.module.css";
import Input from "../Inputs/Inputs";
import AuctionInfoSection from "./InfoAccord";
import FilterAccord from "./FilterAccord";
import { useRouter, useSearchParams } from "next/navigation";

function FilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedValue, setDebouncedValue] = useState(search);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);


  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue.trim()) {
      params.set("search", debouncedValue);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedValue]);

  return (
    <div className={styles.filter}>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Для поиска по аукциону введите номер лота или название"
      />
      <FilterAccord />
      <AuctionInfoSection />
    </div>
  );
}

export default FilterComponent;
