export interface RegisterPayload {
    email: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
    is_verified?: boolean
    username: string
  }

  export interface UserData {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    username: string;
    favorite_lots: number[];
  }