import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, cancelOrder } from "@/services/orderService";
import { QUERY_KEY } from "@/constants/queryKeys";
import { toast } from "sonner";

export interface OrderItem {
  id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  type: string;
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
    images: string[];
    status: string;
    type: string;
    shop_id: number;
    category_id: number;
    views: number;
    created_at: string;
    updated_at: string;
    reviews: any[];
    average_rating: number;
    variations: any[];
  };
}

export interface Order {
  id: number;
  customer_id: number;
  vendor_id: number[];
  total: string;
  payment_method: string;
  shipping_status: string;
  shipping_method: string | null;
  shipping_fee: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_date: string | null;
  delivery_date: string | null;
  payment_date: string | null;
  payment_reference: string | null;
  payment_status: string;
  vendor_payment_settlement_status: string;
  cancel_reason: string | null;
  address_id: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrdersResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Order[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface OrderDetailResponse {
  status: string;
  message: string;
  data: {
    order: Order & {
      address: {
        id: number;
        customer_id: number;
        street_address: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
        address_label: string;
        phone: string;
        created_at: string;
        updated_at: string;
      };
      customer: {
        id: number;
        name: string;
        last_name: string;
        email: string;
        phone: string;
        role: string;
        city: string;
        state: string;
        country: string;
        created_at: string;
        updated_at: string;
      };
    };
    total_orders: number;
    total_amount_spent: string;
    total_cancelled: number;
    total_delivered: number;
  };
}

export function useOrders(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: [QUERY_KEY.order, "list", page, perPage],
    queryFn: async () => {
      const response = await getOrders();
      return response as OrdersResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [QUERY_KEY.order, "detail", orderId],
    queryFn: async () => {
      const response = await getOrderById(orderId);
      return response as OrderDetailResponse;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      toast.success("Order cancelled successfully");

      // Invalidate both the orders list and the specific order detail
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.order, "list"] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.order, "detail", orderId],
      });
    },
    onError: (error: unknown) => {
      console.error("Failed to cancel order:", error);

      const err = error as {
        response?: { status: number; data?: { message?: string } };
      };
      const status = err?.response?.status;
      let errorMessage = "Failed to cancel order. Please try again.";

      if (status === 400) {
        errorMessage = "This order cannot be cancelled.";
      } else if (status === 404) {
        errorMessage = "Order not found.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
}
