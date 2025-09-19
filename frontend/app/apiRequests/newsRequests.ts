import { INews } from "../interfaces/INews";
import { getBaseUrl } from "../lib/api";


const BASE = getBaseUrl();

export async function fetchAllNews(skip: number = 0, limit: number = 10): Promise<INews[]> {
  const res = await fetch(`${BASE}/news/?skip=${skip}&limit=${limit}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchNewsById(newsId: number): Promise<INews> {
  const res = await fetch(`${BASE}/news/${newsId}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function fetchLatestNews(): Promise<INews> {
  const res = await fetch(`${BASE}/news/latest`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}
