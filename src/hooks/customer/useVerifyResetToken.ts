import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import APICall from "@/utils/ApiCall";

interface VerifyResetTokenData {
  email: string;
  confirmation_code: string;
}

interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: {
        [key: string]: string[];
      };
    };
  };
}

const verifyResetTokenAPI = async (data: VerifyResetTokenData) => {
  const response = await APICall("/verify-reset-token", "POST", data);
  return response?.data;
};

export function useVerifyResetToken() {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyResetTokenAPI,
    onSuccess: () => {
      toast.success("Token verified successfully!");
      router.push("/customer/reset-password");
    },
    onError: (error: ErrorResponse) => {
      console.error("Token verification failed:", error);

      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Invalid or expired token. Please try again.";

      if (status === 422) {
        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)[0];
          if (firstError && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        } else {
          errorMessage = responseData?.message || "Invalid token.";
        }
      } else if (status === 404) {
        errorMessage = "Token not found or has expired. Please request a new password reset.";
      } else if (status && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}