import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import { toast } from "sonner";

interface CouponData {
  product_id: string;
  start_time: string;
  end_time: string;
  discount_rate: string;
  notify_users: string;
  status: string;
  discount_type: string;
  discount_code: string;
}

interface CouponResponse {
  data: {
    id: number;
    product_id: number;
    start_time: string;
    end_time: string;
    discount_rate: string;
    notify_users: boolean;
    status: string;
    discount_type: string;
    discount_code: string;
    created_at: string;
    updated_at: string;
  };
  status: string;
  message: string;
}

// API function to create coupon
export async function createCoupon(data: CouponData) {
  try {
    const response = await APICall(
      "/vendor/discount/create",
      "POST",
      data,
      true
    );
    return response as CouponResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to create coupon
export function useAddCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: (data) => {
      console.log("Coupon created successfully:", data);
      // Invalidate coupons query to refetch the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.coupons] });
      toast.success("Coupon created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create coupon:", error);
      
      // Handle validation errors from API
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        if (firstError && firstError.length > 0) {
          toast.error(firstError[0]);
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create coupon. Please try again.");
      }
    },
  });
}
