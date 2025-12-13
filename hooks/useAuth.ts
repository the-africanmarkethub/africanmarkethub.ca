"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleOAuthPayload,
  ChangePasswordPayload,
} from "@/types/auth";
import { handleApiError } from "@/utils/errorHandler";
import toast from "react-hot-toast";

interface ApiError {
  message?: string;
  status?: number;
  statusText?: string;
  errors?: Record<string, string | string[]>;
  type?: string;
  originalError?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceName = "Unknown Device";

  if (userAgent.includes("Mac")) deviceName = "macOS";
  else if (userAgent.includes("Windows")) deviceName = "Windows";
  else if (userAgent.includes("Linux")) deviceName = "Linux";
  else if (userAgent.includes("iPhone")) deviceName = "iPhone";
  else if (userAgent.includes("Android")) deviceName = "Android";

  return deviceName;
};

// Helper function to get IP address (simplified - in production you'd use a service)
const getIPAddress = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return "0.0.0.0"; // Fallback
  }
};

// Register user
const registerUser = async (
  payload: Omit<RegisterPayload, "device_name" | "ip_address">
): Promise<AuthResponse> => {
  const deviceName = getDeviceInfo();
  const ipAddress = await getIPAddress();

  const fullPayload: RegisterPayload = {
    ...payload,
    device_name: deviceName,
    ip_address: ipAddress,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
        };
      }
      throw {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: "Network error: Please check your internet connection",
        type: "network_error",
        originalError: error.message,
      };
    }
    throw error;
  }
};

// Login user
const loginUser = async (
  payload: Omit<LoginPayload, "device_name" | "ip_address">
): Promise<AuthResponse> => {
  const deviceName = getDeviceInfo();
  const ipAddress = await getIPAddress();

  const fullPayload: LoginPayload = {
    ...payload,
    device_name: deviceName,
    ip_address: ipAddress,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
        };
      }
      throw {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: "Network error: Please check your internet connection",
        type: "network_error",
        originalError: error.message,
      };
    }
    throw error;
  }
};

// Verify email
const verifyEmail = async (
  payload: VerifyEmailPayload
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Forgot password
const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
        };
      }
      throw {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: "Network error: Please check your internet connection",
        type: "network_error",
        originalError: error.message,
      };
    }
    throw error;
  }
};

// Reset password
const resetPassword = async (
  payload: Omit<ResetPasswordPayload, "device_name">
): Promise<AuthResponse> => {
  const deviceName = getDeviceInfo();

  const fullPayload: ResetPasswordPayload = {
    ...payload,
    device_name: deviceName,
  };

  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullPayload),
  });

  if (!response.ok) {
    throw new Error(`Password reset failed: ${response.statusText}`);
  }

  return response.json();
};

// Google OAuth login
const googleOAuthLogin = async (
  idToken: string
): Promise<AuthResponse> => {
  const deviceName = getDeviceInfo();
  const ipAddress = await getIPAddress();

  const payload: GoogleOAuthPayload = {
    id_token: idToken,
    device_name: deviceName,
    ip_address: ipAddress,
  };

  const response = await fetch(`${API_BASE_URL}/continue-with-google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Change password
const changePassword = async (
  payload: ChangePasswordPayload
): Promise<AuthResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/change-password`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Hooks
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Handle successful registration
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: ApiError) => {
      console.error("Registration failed:", {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
        full_error: error
      });
      // Handle validation errors from API
      handleApiError(error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Handle successful login
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: ApiError) => {
      console.error("Login failed:", {
        message: error?.message,
        status: error?.status,
        errors: error?.errors,
        full_error: error
      });
      // Handle validation errors from API
      handleApiError(error);
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      console.log("Email verified successfully:", data.message);
    },
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log("Password reset email sent:", data.message);
    },
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      // Handle successful password reset
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};

export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleOAuthLogin,
    onSuccess: (data) => {
      // Handle successful Google OAuth login
      if (data.data?.token) {
        localStorage.setItem("auth_token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Google OAuth failed:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      console.log("Password changed successfully:", data.message);
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};
