// Authentication related types

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
  ip_address?: string;
}

export interface LoginResponse {
  message?: string;
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  email: string;
  email_verified_at: string;
  phone_verified_at: string;
  role: string;
  is_active: number;
  city: string;
  state: string;
  country: string;
  profile_photo: string;
  google_id: string | null;
  referral_code: string;
  referred_by: string | null;
  fcm_token: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = "vendor" | "admin" | "customer";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}