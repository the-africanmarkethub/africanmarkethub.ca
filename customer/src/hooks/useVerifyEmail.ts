import { useMutation } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";

interface VerifyEmailPayload {
  email: string;
  otp: string;
}

interface VerifyEmailResponse {
  message: string;
  status: string;
}

async function verifyEmail(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {
  const response = await APICall("/verify-email", "POST", payload);
  return response;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      console.log("Email verified successfully:", data);
    },
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
}
