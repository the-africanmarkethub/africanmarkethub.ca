import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/services/orderService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import { useCart } from "@/contexts/customer/CartContext";

interface OrderItem {
  product_id: number;
  quantity: number;
  price?: number;
  product_variation_id?: number; // Optional for products without variations
}

interface CreateOrderPayload {
  products: OrderItem[];
  address_id: number;
  payment_method?: string;
  coupon_code?: string;
  notes?: string;
}

interface OrderResponse {
  message: string;
  data: {
    order_id: string;
    order_number: string;
    total_amount: number;
    status: string;
    payment_url?: string;
  };
}

interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearCart } = useCart();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (data: OrderResponse) => {
      toast.success(data.message || "Order created successfully!");
      
      // Clear the cart after successful order
      clearCart();
      
      // Invalidate orders query to refresh the orders list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.order] });
      
      // Redirect to order confirmation or payment page
      if (data.data.payment_url) {
        // If there's a payment URL, redirect to payment
        window.location.href = data.data.payment_url;
      } else {
        // Otherwise redirect to order confirmation
        router.push(`/orders/${data.data.order_id}`);
      }
    },
    onError: (error: ErrorResponse) => {
      console.error("Order creation failed:", error);

      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Failed to create order. Please try again.";

      if (status === 400) {
        // Bad request - validation errors
        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : "Invalid order data.";
        } else {
          errorMessage = responseData?.message || "Invalid order data.";
        }
      } else if (status === 401) {
        errorMessage = "Please login to place an order.";
        router.push("/sign-in");
      } else if (status === 422) {
        // Unprocessable entity
        if (responseData?.errors) {
          const errors = responseData.errors;
          if (errors.items) {
            errorMessage = "Invalid items in order.";
          } else if (errors.shipping_address_id) {
            errorMessage = "Please select a valid shipping address.";
          } else if (errors.payment_method) {
            errorMessage = "Please select a valid payment method.";
          } else {
            // Check for product variation errors
            const productErrors = Object.keys(errors).filter(key => 
              key.includes('product_variation_id') || key.includes('products.')
            );
            
            if (productErrors.length > 0) {
              const firstProductError = errors[productErrors[0]];
              errorMessage = Array.isArray(firstProductError) 
                ? firstProductError[0] 
                : "Invalid product variation selected.";
            } else {
              const firstError = Object.values(errors)[0];
              errorMessage = Array.isArray(firstError) ? firstError[0] : "Invalid order data.";
            }
          }
        } else {
          errorMessage = responseData?.message || "Unable to process order.";
        }
      } else if (status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (status && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}