import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";

interface Deal {
  id: number;
  discount_code: string;
  product_id: number;
  vendor_id: number;
  start_time: string;
  end_time: string;
  discount_rate: string;
  discount_type: string;
  notify_users: number;
  status: string;
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
    available_from?: string | null;
    available_to?: string | null;
    available_days?: string | null;
    estimated_delivery_time?: string | null;
    delivery_method?: string | null;
    pricing_model?: string | null;
    views: number;
    created_at: string;
    updated_at: string;
    average_rating: number;
    variations: Array<{
      id: number;
      product_id: number;
      size_id?: number | null;
      color_id?: number | null;
      price: string;
      quantity: number;
      sku: string;
      created_at: string;
      updated_at: string;
      color?: {
        id: number;
        name: string;
        hexcode: string;
        created_at: string;
        updated_at: string;
      } | null;
      size?: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
      } | null;
    }>;
    reviews?: any[];
  };
}

interface DealsResponse {
  status: string;
  message: string;
  data: Deal[];
  total_time_left: string;
}

async function fetchProductDeals(): Promise<DealsResponse> {
  const response = await APICall("/products/deals", "GET");
  return response;
}

export function useProductDeals() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.products, "deals"],
    queryFn: fetchProductDeals,
    enabled: typeof window !== "undefined", // Only run on client side
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.products, "deals"]);
    },
  });

  return query;
}