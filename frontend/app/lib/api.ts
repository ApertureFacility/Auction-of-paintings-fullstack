// frontend/app/lib/api.ts

export const getBaseUrl = (): string => {
    if (typeof window !== "undefined") {
      // Браузер → использует публичный URL
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    }
    // Сервер (SSR) → ходит к backend по имени сервиса
    return process.env.SERVER_API_URL || "http://backend:8000";
  };
  