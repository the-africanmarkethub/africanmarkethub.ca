// Authentication related types

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
  ip_address?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  shopId?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
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