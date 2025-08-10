import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
          }
          throw new Error("Токен недействителен");
        }

        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        setError(err instanceof Error ? err.message : "Ошибка проверки токена");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (token: string) => {
    try {

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Неверный токен авторизации");
      }

      localStorage.setItem("access_token", token);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      return false;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("access_token");

    try {
      if (token) {
        const response = await fetch(`${API_URL}/auth/jwt/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Ошибка выхода");
        }
      }
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      localStorage.removeItem("access_token");
      setIsAuthenticated(false);
      setError(null);
    }
  };

  return { 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    logout 
  };
}