import { useQuery } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

// Types for the API response
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

// Note: If pagination is needed later, the API might return paginated response

interface CouponsResponse {
  status: string;
  message: string;
  data: Coupon[];
}

interface CouponsParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

// API function to fetch coupons
export async function getCoupons(params: CouponsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add optional parameters
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params.status) queryParams.set("status", params.status);
    if (params.search) queryParams.set("search", params.search);

    const url = queryParams.toString() 
      ? `vendor/discounts?${queryParams.toString()}`
      : "vendor/discounts";
      
    const response = await APICall(url, "GET");
    return response as CouponsResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch coupons
export function useGetCoupons(params: CouponsParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY.coupons, params],
    queryFn: () => getCoupons(params),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}

// Convenience hooks for common use cases
export function useSearchCoupons(search: string, page?: number) {
  return useGetCoupons({ search, page });
}

export function useGetCouponsByPage(page: number) {
  return useGetCoupons({ page });
}

export function useGetCouponsByStatus(status: string, page?: number) {
  return useGetCoupons({ status, page });
}