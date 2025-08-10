
import { LotResponse } from "../interfaces/ILot";


const API_URL = process.env.NEXT_PUBLIC_API_URL



export async function fetchSingleLot(id: string) {
    if (!id) throw new Error(" lot ID is required");
    const res = await fetch(`${API_URL}/lots/${id}`);
    if (!res.ok) {
      throw new Error("Single lot load by id error");
    }
    return res.json();
  }



  
export const fetchLots = async (
  page: number,
  limit: number
): Promise<LotResponse> => {
  const offset = (page - 1) * limit;

  const response = await fetch(
    `${API_URL}/lots/?limit=${limit}&offset=${offset}`,
    {
      headers: { Accept: "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export async function fetchLotsSearch(search: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const res = await fetch(
    `${API_URL}/lots/search?q=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Ошибка загрузки данных: ${res.status}`);
  return res.json();
}
