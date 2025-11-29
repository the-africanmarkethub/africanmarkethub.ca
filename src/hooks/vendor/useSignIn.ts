"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/vendor/auth-context";
import { toast } from "sonner";
import { LoginRequest, LoginResponse } from "@/types/vendor/api";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const signInVendor = async (
  values: LoginRequest
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, values, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    // Create a ValidationError object for React Query and forms
    if (axios.isAxiosError(error)) {
      const validationError = new Error(
        error.response?.data?.message || error.message
      ) as ValidationError;
      validationError.response = error.response;
      validationError.validationErrors = error.response?.data?.errors;
      throw validationError;
    }
    throw error;
  }
};

// ValidationError for compatibility with forms and proper error handling
export interface ValidationError extends Error {
  validationErrors?: Record<string, string[]>;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export function useSignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const mutate = useMutation<LoginResponse, ValidationError, LoginRequest>({
    mutationFn: signInVendor,
    onSuccess: (data) => {
      // Check if user is a vendor before proceeding
      if (data.user?.role !== "vendor") {
        toast.error("Access denied. This platform is for vendors only.");
        throw new Error("Access denied. This platform is for vendors only.");
      }

      console.log("Vendor login successful:", data);

      // Use auth context to handle login - the API response already matches the expected structure
      login(data.token, data);

      // Use the message from API response
      toast.success(data.message || "Log In Successful!");

      // Check for redirect URL
      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        localStorage.removeItem("redirectUrl");
        router.push(redirectUrl);
      } else {
        router.push("/vendor");
      }
    },
    onError: (error: ValidationError) => {
      console.log("Vendor login error:", error);

      let errorMessage = "Login failed. Please try again.";

      // Check if it's a validation error (422)
      if (error.validationErrors) {
        const firstErrorKey = Object.keys(error.validationErrors)[0];
        const firstError = error.validationErrors[firstErrorKey];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
  return mutate;
}
