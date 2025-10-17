"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api-call";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { LoginRequest, LoginResponse } from "@/types/api";

export async function signIn(values: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/login", values);
  if (!response) {
    throw new Error("Login failed");
  }
  return response;
}

export interface ValidationError extends Error {
  validationErrors?: Record<string, string[]>;
}

export function useSignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const mutate = useMutation<LoginResponse, ValidationError, LoginRequest>({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Use auth context to handle login
      login(data.token, data.user);
      
      toast.success("Log In Successful!");
      
      // Check for redirect URL
      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        localStorage.removeItem("redirectUrl");
        router.push(redirectUrl);
      } else {
        router.push("/overview");
      }
    },
    onError: (error: ValidationError) => {
      // The toast is already shown in api-call.ts
      // This is just for any additional error handling if needed
      console.error("Login error:", error);
    },
  });
  return mutate;
}
