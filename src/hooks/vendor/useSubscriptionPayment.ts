import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

export async function processSubscriptionPayment(paymentData: any) {
  try {
    const url = "/vendor/subscription/payment";
    const response = await APICall(url, "POST", paymentData);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSubscriptionPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: any) => processSubscriptionPayment(paymentData),
    onSuccess: () => {
      toast.success("Subscription payment processed successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.shopDetails] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process subscription payment");
    },
  });
}