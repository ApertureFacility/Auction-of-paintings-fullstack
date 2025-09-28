// AuthProvider.tsx
'use client';
import { useEffect } from "react";
import { useAuthStore } from "./authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const verifyAuth = useAuthStore((state) => state.verifyAuth);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return <>{children}</>;
}
