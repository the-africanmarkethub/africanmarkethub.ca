export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  user?: {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    referral_code: string;
    referred_by: string | null;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    email_verified_at: string;
    phone_verified_at: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface AuthContextType {
  user: User | null | undefined; // Updated to include undefined
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
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
export interface SignupCredentials {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string;
  ip_address?: string;
  device_name: string;
}

export interface OtpVerificationResponse {
  message: string;
}

export interface LoginResponse {
  status: string;
  user: User;
  authorisation: {
    token: string;
    type: string;
  };
}

export type CustomerProfile = {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
};
