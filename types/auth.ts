export type UserType = 'customer' | 'vendor'

export interface User {
  id: string;
  email: string;
  name: string;
  last_name: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  device_name: string;
  ip_address: string;
}

export interface AuthResponse {
  status?: string;
  message: string;
  token?: string;
  user?: User;
  data?: {
    user: User;
    token: string;
  };
}

// Register payload
export interface RegisterPayload {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'customer';
  password: string;
  device_name: string;
  ip_address: string;
}

// Login payload  
export interface LoginPayload {
  email: string;
  password: string;
  ip_address: string;
  device_name: string;
}

// Verify email payload
export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

// Forgot password payload
export interface ForgotPasswordPayload {
  email: string;
}

// Reset password payload
export interface ResetPasswordPayload {
  email: string;
  new_password: string;
  confirmation_code: string;
  device_name: string;
}

// Google OAuth payload
export interface GoogleOAuthPayload {
  id_token: string;
  device_name: string;
  ip_address: string;
}

// Change password payload
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Legacy types for compatibility
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  type: UserType
}