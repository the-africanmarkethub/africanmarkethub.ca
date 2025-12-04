import { Product } from "./product";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  price: string;
  type: "cart";
  subtotal: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface CartResponse {
  status: string;
  message: string;
  data: CartItem[];
}

export interface AddToCartPayload {
  cart_items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface AddToCartResponse {
  status: string;
  message: string;
  data: CartItem[];
}
