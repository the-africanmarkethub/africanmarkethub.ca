export interface UserData {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_photo: string;
  role: string;
  city: string;
  state: string;
  country: string;
  is_active: number;
  google_id: string | null;
  fcm_token: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  user: UserData;
  token: string;
}
export interface AuthContextType {
  user: UserData | null | undefined; // Updated to include undefined
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  logOut: () => void;
  //   refreshAuth: () => void;
  loginError: Error | null;
  isLoginLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  ip_address: string;
  device_name: string;
}

// File: src/types/auth.types.ts
export interface CreateShopPayload {
  name: string;
  address: string;
  type: "products" | "services";
  description: string;
  logo?: File; // Assuming logo and banner are File objects from file input
  banner?: File;
  subscription_id: string;
  billing_cycle?: string;
  state_id: string;
  city_id: string;
  country_id: string;
  category_id: string;
  // role: "vendor";
}

export interface VerifyEmailPayload {
  otp: string;
  email: string;
}

export interface ResendEmailVerificationPayload {
  email: string;
}
