import { RegisterPayload, UserData } from "../interfaces/IUser";
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
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка регистрации");
  }
  return res.json();
}


export async function loginUser({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${BASE}/auth/cookie/login-refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "accept": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Ошибка авторизации");
  }

  return res.json(); 
}



export async function addLotToFavorites(lotId: number) {
  const res = await fetch(`${BASE}/favorites/add/${lotId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    credentials: "include", 
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Не удалось добавить лот в избранное");
  }

  return true;
}

export async function removeLotFromFavorites(lotId: number) {
  const res = await fetch(`${BASE}/favorites/remove/${lotId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Не удалось удалить лот из избранного");
  }

  return true;
}


export async function forgotPassword(email: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/forgot-password`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw { status: res.status, detail: data.detail || "Ошибка при запросе" };
  }

  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }), 
  });

  const data = await res.json();
  if (!res.ok) throw { status: res.status, detail: data.detail };
  return data;
}

export async function loginUserCookie({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cookie/login-refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", 
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ошибка авторизации");
  }
  const data = await res.json();
  return data;
}



export const getCurrentUser = async (): Promise<UserData> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Ошибка при получении пользователя");
  }

  return res.json();
};