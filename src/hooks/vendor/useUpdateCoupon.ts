import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

interface UpdateCouponData {
  product_id?: string;
  start_time?: string;
  end_time?: string;
  discount_rate?: string;
  notify_users?: string;
  status?: string;
  discount_type?: string;
  discount_code?: string;
}

interface UpdateCouponResponse {
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

// API function to update coupon
export async function updateCoupon(couponId: number, data: UpdateCouponData) {
  try {
    const response = await APICall(
      `/vendor/coupons/update/${couponId}`,
      "PUT",
      data,
      true
    );
    return response as UpdateCouponResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to update coupon
export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ couponId, data }: { couponId: number; data: UpdateCouponData }) => 
      updateCoupon(couponId, data),
    onSuccess: (data) => {
      // Invalidate coupons query to refetch the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.coupons] });
    },
    onError: (error) => {
      // Error handling for coupon update failure
    },
  });
}