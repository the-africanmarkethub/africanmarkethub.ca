// import { refreshAccessToken } from "@/hooks/useSignIn";
import axios from "axios";
import { toast } from "sonner";

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function APICall(
  Url: string,
  Method: "GET" | "POST" | "PUT" | "DELETE",
  Data?: unknown,
  isFormData = false,
  timeoutOverride?: number | null,
  silent?: boolean
) {
  // Check for vendor token first (for vendor routes), then customer token
  const authToken = localStorage.getItem("vendorAccessToken") || localStorage.getItem("accessToken");

  // Create a clean axios instance for this request
  const axiosInstance = axios.create();

  // Set up response interceptor for this instance only
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response?.data?.authorization) {
        // Determine which token to update based on URL or existing token
        const isVendorRoute = Url.includes("/vendor") || Url.includes("/shop");
        const tokenKey = isVendorRoute ? "vendorAccessToken" : "accessToken";
        localStorage.setItem(tokenKey, response.data.authorization);
      }
      return response;
    },
    (error) => {
      console.log(error, "THE ERROR");
      // Don't return error.response, let it throw properly
      return Promise.reject(error);
    }
  );

  // Construct URL properly
  let baseUrl = Base_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, "");

  // Remove leading slash from endpoint
  const cleanUrl = Url.replace(/^\//, "");

  const fullUrl = `${baseUrl}/${cleanUrl}`;

  const response = await axiosInstance({
    method: Method,
    url: fullUrl,
    data: Data,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : undefined,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
    // timeout: timeoutOverride || process.env.REACT_APP_REQUEST_TIMEOUT,
  });

  if (response) {
    if (!response.status) {
      if (!silent)
        toast.error("Please check your network connection and try again");
      return null;
    }

    if (response.status >= 400 && response.status < 500) {
      if (response.status === 401) {
        // Don't clear localStorage on 401 errors to prevent unwanted redirects
        // 401 errors should only show error messages, not clear auth state
        // If we need to handle token expiration, it should be done explicitly elsewhere
      }
      toast.error(
        response?.data?.message ||
          response?.data?.responseMessage ||
          response?.data
      );
      return null;
    }

    if (response.status >= 500) {
      let message =
        "Sorry your request cannot be processed at this moment please try again later";
      if (response.data.message) {
        message = `${response.data.message}`;
      }
      if (!silent) toast.error(message);
      return null;
    }
    //
  } else {
    toast.error("Server error, please try again");
  }

  return !response
    ? null
    : response.data
    ? response.data
    : { status: "success" };
}

// Utility functions for handling API responses
export function handleNoResultsResponse<T>(response: any): T | null {
  if (!response || !response.data || response.data.length === 0) {
    return null;
  }
  return response;
}

export function createEmptyPaginatedResponse() {
  return {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10
    }
  };
}
