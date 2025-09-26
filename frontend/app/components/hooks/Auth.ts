import { getCurrentUser } from "@/app/apiRequests/userRequests";
import { useEffect, useState } from "react";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setError(null);
      return true;
    } else {
      setError("Неверный токен");
      localStorage.removeItem("access_token");
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setError(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };
}
