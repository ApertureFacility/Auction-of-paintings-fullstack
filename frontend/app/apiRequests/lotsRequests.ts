import { LotResponse } from "../interfaces/ILot";
import { getBaseUrl } from "../lib/api";


const BASE = getBaseUrl();


export async function fetchSingleLot(id: string) {
  if (!id) throw new Error("lot ID is required");
  const res = await fetch(`${BASE}/lots/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Single lot load by id error: ${res.status}`);
  }
  return res.json();
}


export const fetchLots = async (
  page: number,
  limit: number
): Promise<LotResponse> => {
  const offset = (page - 1) * limit;
  const res = await fetch(`${BASE}/lots/?limit=${limit}&offset=${offset}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};


export async function fetchLotsSearch(search: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const res = await fetch(
    `${BASE}/lots/search?q=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Ошибка загрузки данных: ${res.status}`);
  return res.json();
}
