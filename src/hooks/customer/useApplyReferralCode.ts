import { useMutation } from "@tanstack/react-query";
import { applyReferralCode, ApplyReferralCodeRequest } from "@/services/referralService";
import { toast } from "sonner";

export const useApplyReferralCode = () => {
  return useMutation({
    mutationFn: (data: ApplyReferralCodeRequest) => applyReferralCode(data),
    onSuccess: (response) => {
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Referral code applied successfully!");
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to apply referral code. Please try again.";
      toast.error(errorMessage);
    },
  });
};