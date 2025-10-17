// import { refreshAccessToken } from "@/hooks/useSignIn";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ErrorResponse {
  message?: string;
}

// Generic interface for paginated data
interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// Generic function to handle 404 "No results found" responses
export function handleNoResultsResponse<T>(
  error: unknown,
  noResultsMessage: string,
  defaultData: T
): T | null {
  if (error && typeof error === "object" && "response" in error) {
    const errorResponse = error as {
      response?: {
        status: number;
        data: {
          message?: string;
          status?: string;
          data?: unknown;
        };
      };
    };

    const status = errorResponse.response?.status;
    const responseData = errorResponse.response?.data;

    if (status === 404 && responseData?.message === noResultsMessage) {
      // This is a valid "no results" response, not an error
      return defaultData;
    }
  }

  // Re-throw other errors
  throw error;
}

// Generic function to create empty paginated response
export function createEmptyPaginatedResponse<T>(): { data: PaginatedData<T> } {
  return {
    data: {
      current_page: 1,
      data: [],
      first_page_url: "",
      from: null,
      last_page: 1,
      last_page_url: "",
      links: [],
      next_page_url: null,
      path: "",
      per_page: 20,
      prev_page_url: null,
      to: null,
      total: 0,
    },
  };
}

// Generic function to create empty products response
export function createEmptyProductsResponse() {
  return {
    products: {
      data: [],
      message: "No products found",
    },
  };
}

export default async function APICall(
  Url: string,
  Method: "GET" | "POST" | "PUT" | "DELETE",
  Data?: unknown,
  isFormData = false,
  silent?: boolean
) {
  const authToken = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios({
      method: Method,
      baseURL: Base_URL,
      url: Url,
      data: Data,
      headers: headers,
    });
    // On success, always return the data from the API response
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    // Centralized toast notifications for specific, common errors
    if (!silent) {
      const status = axiosError.response?.status;

      if (status === 401) {
        // Check if this is a user-specific endpoint that requires authentication
        const requiresAuth = Url.includes('/customer/') || 
                            Url.includes('/account/') || 
                            Url.includes('/user/') ||
                            Method !== "GET"; // Non-GET requests typically require auth
        
        if (requiresAuth) {
          // Only clear storage and redirect for endpoints that actually need auth
          localStorage.clear();
          toast.error("Session expired. Please log in again.");
          if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
          }
        }
        // For public endpoints (products, categories, etc.), just let the error bubble up
        // without redirecting or clearing storage
      } else if (status === 500) {
        // Handle server errors globally
        toast.error("A server error occurred. Please try again later.");
      }
    }

    // VERY IMPORTANT: Re-throw the error so React Query can handle it.
    // This allows individual hooks to add custom logic for specific errors
    // like 404 Not Found.
    throw axiosError;
  }
}
