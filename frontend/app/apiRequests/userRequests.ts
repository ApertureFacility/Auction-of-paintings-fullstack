import { RegisterPayload } from "../interfaces/IUser"


  
  const API_URL = process.env.NEXT_PUBLIC_API_URL



  export async function registerUser(payload: RegisterPayload) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Ошибка регистрации")
    }
  
    return response.json()
  }



  export async function loginUser({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("username", email)
    formData.append("password", password)
  
    const response = await fetch(`${API_URL}/auth/jwt/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Ошибка авторизации")
    }
    const data = await response.json()
    localStorage.setItem("access_token", data.access_token)
    return data
  }

  export async function addLotToFavorites(lotId: number) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Сначала войдите в аккаунт");
    }
  
    const res = await fetch(`${API_URL}/favorites/add/${lotId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Не удалось добавить в избранное");
    }
  
    return true;
  }



export async function fetchCurrentUser() {

  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  
  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include' 
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("access_token");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export const removeLotFromFavorites = async (lotId: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  if (!token) {
    throw new Error("Сначала войдите в аккаунт");
  }

  const response = await fetch(`${API_URL}/favorites/remove/${lotId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Не удалось удалить лот из избранного");
  }

  return await response.json();
};

