import { useQuery } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

// Types for the API response (single coupon)
interface Coupon {
  id: number;
  discount_code: string;
  product_id: number;
  vendor_id: number;
  start_time: string;
  end_time: string;
  discount_rate: string;
  discount_type: "percentage" | "fixed";
  notify_users: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    sales_price: string;
    regular_price: string;
    quantity: number;
    notify_user: number;
    images: string[];
    image_public_ids: string[];
    status: string;
    type: string;
    shop_id: number;
    category_id: number;
    available_from: string | null;
    available_to: string | null;
    available_days: string | null;
    estimated_delivery_time: string | null;
    delivery_method: string | null;
    pricing_model: string | null;
    views: number;
    created_at: string;
    updated_at: string;
    average_rating: number;
    variations: any[];
  };
}

interface CouponResponse {
  status: string;
  message: string;
  data: Coupon;
}

// API function to fetch a single coupon
export async function getCoupon(couponId: string) {
  try {
    const response = await APICall(`/vendor/discount/${couponId}`, "GET");
    return response as CouponResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch a single coupon
export function useGetCoupon(couponId: string) {
  return useQuery({
    queryKey: [QUERY_KEY.coupons, couponId],
    queryFn: () => getCoupon(couponId),
    enabled: !!couponId, // Only run query if couponId exists
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}