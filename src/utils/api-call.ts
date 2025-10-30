import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { ApiResponse, ApiError } from "@/types/api";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiCallOptions {
  isFormData?: boolean;
  timeout?: number;
  silent?: boolean;
}

export default async function apiCall<T = unknown>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  options: ApiCallOptions = {}
): Promise<T | null> {
  const { isFormData = false, timeout, silent = false } = options;
  
  try {
    // Check for vendor token first (for vendor routes), then customer token
    const authToken = localStorage.getItem("vendorAccessToken") || localStorage.getItem("accessToken");

    if (!BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
    }

    // Clean URL construction
    const baseUrl = BASE_URL.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\//, "");
    const fullUrl = `${baseUrl}/${cleanUrl}`;

    const config: AxiosRequestConfig = {
      method,
      url: fullUrl,
      data,
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : undefined,
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
      timeout: timeout || 120000, // 2 minutes default
    };

    const response = await axios(config);

    // Update token if provided in response
    if (response.data?.authorization) {
      // Determine which token to update based on URL or existing token
      const isVendorRoute = url.includes("/vendor") || url.includes("/shop");
      const tokenKey = isVendorRoute ? "vendorAccessToken" : "accessToken";
      localStorage.setItem(tokenKey, response.data.authorization);
    }

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      // Handle 401 Unauthorized
      if (axiosError.response?.status === 401) {
        // Only clear storage and redirect for authenticated requests, not login attempts
        const isLoginAttempt = url.includes("/login") || url.includes("/sign-in");
        
        if (!isLoginAttempt) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("vendorAccessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("vendorUser");
          // Don't redirect immediately - let auth contexts handle it
        }
        // For login attempts: just throw error, don't clear storage or redirect
        return null;
      }

      // Handle validation errors
      const responseData = axiosError.response?.data as ApiError;
      let errorMessage = responseData?.message || axiosError.message || "An unexpected error occurred";
      
      // Check for validation errors in the format {"errors":{"field":["message"]}}
      if ((responseData as any)?.errors) {
        const fieldErrors = Object.entries((responseData as any).errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
          .join("; ");
        errorMessage = fieldErrors || errorMessage;
      }

      if (!silent) {
        toast.error(errorMessage);
      }

      // Create an error with both message and validation errors
      const customError = new Error(errorMessage) as any;
      customError.validationErrors = (responseData as any)?.errors;
      throw customError;
    }

    // Non-Axios errors
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    if (!silent) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage);
  }
}

// Typed API call helper functions
export const api = {
  get: <T = unknown>(url: string, options?: ApiCallOptions) => 
    apiCall<T>(url, "GET", undefined, options),
  
  post: <T = unknown>(url: string, data?: unknown, options?: ApiCallOptions) => 
    apiCall<T>(url, "POST", data, options),
  
  put: <T = unknown>(url: string, data?: unknown, options?: ApiCallOptions) => 
    apiCall<T>(url, "PUT", data, options),
  
  delete: <T = unknown>(url: string, options?: ApiCallOptions) => 
    apiCall<T>(url, "DELETE", undefined, options),
};