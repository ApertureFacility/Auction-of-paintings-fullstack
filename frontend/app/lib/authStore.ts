import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verifyToken: () => Promise<void>;
  login: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,


  verifyToken: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        localStorage.removeItem("access_token");
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      set({ isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        isAuthenticated: false,
        error: err instanceof Error ? err.message : "Ошибка проверки токена",
        isLoading: false
      });
    }
  },


  login: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Неверный токен");

      localStorage.setItem("access_token", token);
      set({ isAuthenticated: true, error: null });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Ошибка входа"
      });
      return false;
    }
  },


  logout: async () => {
    const token = localStorage.getItem("access_token");
    try {
      if (token) {
        await fetch(`${API_URL}/auth/jwt/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      localStorage.removeItem("access_token");
      set({ isAuthenticated: false, error: null });
    }
  }
}));
