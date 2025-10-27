import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

interface DeleteCouponResponse {
  status: string;
  message: string;
}

// API function to delete coupon
export async function deleteCoupon(couponId: number) {
  try {
    const response = await APICall(
      `/vendor/discount/delete/${couponId}`,
      "DELETE",
      null,
      true
    );
    return response as DeleteCouponResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to delete coupon
export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: (data) => {
      console.log("Coupon deleted successfully:", data);
      // Invalidate coupons query to refetch the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.coupons] });
    },
    onError: (error) => {
      console.error("Failed to delete coupon:", error);
    },
  });
}