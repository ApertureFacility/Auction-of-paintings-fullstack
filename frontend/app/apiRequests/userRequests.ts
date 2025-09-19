import { RegisterPayload } from "../interfaces/IUser";
import { getBaseUrl } from "../lib/api";


const BASE = getBaseUrl();

export async function requestVerification(email: string) {
  const res = await fetch(`${BASE}/users/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Не удалось отправить письмо для верификации");
  return res.json();
}

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка регистрации");
  }
  return res.json();
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${BASE}/auth/jwt/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка авторизации");
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  return data;
}

export async function addLotToFavorites(lotId: number) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Сначала войдите в аккаунт");

  const res = await fetch(`${BASE}/favorites/add/${lotId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Не удалось добавить в избранное");
  }
  return true;
}

export async function fetchCurrentUser() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) return null;

  try {
    const res = await fetch(`${BASE}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("access_token");
        return null;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

export const removeLotFromFavorites = async (lotId: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Сначала войдите в аккаунт");

  const res = await fetch(`${BASE}/favorites/remove/${lotId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Не удалось удалить лот из избранного");
  }
  return res.json();
};
