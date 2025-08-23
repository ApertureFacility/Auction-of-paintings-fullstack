import { INews } from "../interfaces/INews";



const API_URL = process.env.NEXT_PUBLIC_API_URL



export async function fetchAllNews(skip: number = 0, limit: number = 10): Promise<INews[]> {
  const response = await fetch(`${API_URL}/news/?skip=${skip}&limit=${limit}`, {
    headers: { 
      "Accept": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}