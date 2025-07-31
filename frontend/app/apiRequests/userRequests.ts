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