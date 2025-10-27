import { Product } from "./product.types";

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
  product: Product;
  size_id?: number | null;
  size?: {
    id: number;
    name: string;
  };
  color_id?: number | null;
  color?: {
    id: number;
    name: string;
    hexcode: string;
  };
}

export interface Cart {
  id: number;
  user_id: number;
  session_id: string | null;
  total: string;
  created_at: string;
  updated_at: string;
  cart_items: CartItem[];
}

export interface AddToCartPayloadItem {
  product_id: number;
  quantity: number;
  size_id?: number;
  color_id?: number;
  // Optional product data for guest cart optimization
  product?: Product;
}

export interface AddToCartPayload {
  cart_items: AddToCartPayloadItem[];
}

export interface LocalCartItem extends AddToCartPayloadItem {
  product: Product;
  added_at: string; // for cache invalidation
}
