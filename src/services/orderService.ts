import APICall from "@/utils/ApiCall";

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

export const createOrder = async (payload: CreateOrderPayload) => {
  // Convert to FormData format expected by the API
  const formData = new FormData();

  // Add products array
  payload.products.forEach((product, index) => {
    formData.append(
      `products[${index}][product_id]`,
      product.product_id.toString()
    );
    formData.append(
      `products[${index}][quantity]`,
      product.quantity.toString()
    );
    // Always add product_variation_id - use provided value or null for products without variations
    formData.append(
      `products[${index}][product_variation_id]`,
      product.product_variation_id ? product.product_variation_id.toString() : ""
    );
  });

  // Add address_id
  formData.append("address_id", payload.address_id.toString());

  // Add optional fields
  if (payload.payment_method) {
    formData.append("payment_method", payload.payment_method);
  }
  if (payload.coupon_code) {
    formData.append("coupon_code", payload.coupon_code);
  }
  if (payload.notes) {
    formData.append("notes", payload.notes);
  }

  const res = await APICall("/customer/order/create", "POST", formData, true);
  return res;
};

export const getOrders = async () => {
  const res = await APICall("/orders", "GET");
  return res;
};

export const getOrderById = async (orderId: string) => {
  const res = await APICall(`/orders/${orderId}`, "GET");
  return res;
};

export const cancelOrder = async (orderId: string) => {
  const res = await APICall(`/order/${orderId}/cancel`, "POST");
  return res;
};
