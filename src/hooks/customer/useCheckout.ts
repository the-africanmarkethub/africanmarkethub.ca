import { useMutation } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { toast } from "sonner";

interface CheckoutData {
  order_item_id: number[];
  address_id: number;
}

interface CheckoutResponse {
  success: boolean;
  message?: string;
  data?: any;
}

async function performCheckout(data: CheckoutData): Promise<CheckoutResponse> {
  const response = await APICall("/customer/checkout", "POST", data);
  return response.data;
}

export function useCheckout() {
  return useMutation({
    mutationFn: performCheckout,
    onSuccess: (data) => {
      toast.success(data.message || "Checkout successful!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Checkout failed. Please try again."
      );
    },
  });
}