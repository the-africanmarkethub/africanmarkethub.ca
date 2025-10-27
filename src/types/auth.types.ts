export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin';
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Customer specific fields
  addresses?: Address[];
  preferences?: UserPreferences;
  // Vendor specific fields
  shopId?: string;
  businessProfile?: BusinessProfile;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
  };
  language?: string;
  currency?: string;
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessAddress?: string;
  taxId?: string;
  businessLicense?: string;
  documents?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: 'customer' | 'vendor';
  agreeToTerms: boolean;
  referralCode?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  type: 'email_verification' | 'password_reset' | 'phone_verification';
}

export interface CreateShopRequest {
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessAddress?: string;
  shopName: string;
  shopDescription?: string;
  logo?: File | string;
  banner?: File | string;
}