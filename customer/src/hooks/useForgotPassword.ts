import { useMutation } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: {
        email?: string[];
      };
    };
  };
  errors?: {
    email?: string[];
  };
}

async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const response = await APICall("/forget-password", "POST", payload);
  return response;
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset code sent successfully!");
      router.push("/reset-password");
    },
    onError: (error: ErrorResponse) => {
      console.error("Forgot password failed:", error);

      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Failed to send reset code. Please try again.";

      // Check for direct error structure (when error is the response itself)
      if (error?.errors?.email) {
        errorMessage = error.errors.email[0];
      } else if (status === 404) {
        errorMessage = "Email address not found. Please check your email.";
      } else if (status === 422) {
        if (responseData?.errors?.email) {
          errorMessage = responseData.errors.email[0];
        } else {
          errorMessage = responseData?.message || "Invalid email address.";
        }
      } else if (status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (status && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}
