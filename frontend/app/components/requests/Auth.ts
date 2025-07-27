
export type RegisterPayload = {
    email: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
    is_verified?: boolean
    username: string
  }
  
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
  