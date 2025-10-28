import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import APICall from "@/utils/ApiCall";
import { getDeviceInfo } from "@/utils/helper";

interface ResetPasswordData {
  email: string;
  new_password: string;
  confirmation_code: string;
  device_name: string;
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

const resetPasswordAPI = async (data: ResetPasswordData) => {
  const response = await APICall("/reset-password", "POST", data);
  return response?.data;
};

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPasswordAPI,
    onSuccess: () => {
      toast.success("Password reset successful! You can now sign in with your new password.");
      router.push("/customer/sign-in");
    },
    onError: (error: ErrorResponse) => {
      console.error("Reset password failed:", error);

      // Handle specific error responses
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Failed to reset password. Please try again.";

      if (status === 422) {
        // Validation errors
        if (responseData?.errors) {
          // Extract first error message from validation errors
          const firstError = Object.values(responseData.errors)[0];
          if (firstError && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        } else {
          errorMessage = responseData?.message || "Invalid reset token or expired link.";
        }
      } else if (status === 400) {
        // Bad request
        errorMessage = responseData?.message || "Invalid reset request.";
      } else if (status === 404) {
        // Token not found or expired
        errorMessage = "Reset token not found or has expired. Please request a new password reset.";
      } else if (status && status >= 500) {
        // Server error
        errorMessage = "Server error. Please try again later.";
      } else {
        // Fallback to response message or default
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}