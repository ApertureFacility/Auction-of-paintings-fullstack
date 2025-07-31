export interface RegisterPayload {
    email: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
    is_verified?: boolean
    username: string
  }
  