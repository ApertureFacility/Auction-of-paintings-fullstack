import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  verifyAuth: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,


  verifyAuth: async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        credentials: "include", 
      });

      if (!response.ok) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      set({ isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        isAuthenticated: false,
        error: err instanceof Error ? err.message : "Ошибка проверки авторизации",
        isLoading: false,
      });
    }
  },


  login: () => {
    set({ isAuthenticated: true, error: null });
  },


  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/cookie/logout`, {
        method: "POST",
        credentials: "include", 
      });
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      set({ isAuthenticated: false, error: null });
    }
  },
}));
