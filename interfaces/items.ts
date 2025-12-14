import { Shop } from "./shop";

export default interface Item {
  id: number;
  title: string;
  slug: string;
  description: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  notify_user: boolean;
  images: string[];
  image_public_ids: string[];
  status: string;
  type: string;
  shop_id: number;
  category_id: number;
  views: number;
  created_at: string;
  updated_at: string;
  category: Category;
  shop: Shop;
  sku: string;
  reviews: [];
  average_rating: number;
  variations: Variation[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}
 

export interface Variation {
  id?: number;
  name?: string;
  price?: string;
  [key: string]: unknown;
}
