import { Product } from "./products";
import { User } from "./user";

export default interface ReviewType {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  images: string[];
  image_public_ids: string[];
  rating: number;
  created_at: string;
  updated_at: string;
  user: User
  product: Product;
}

export interface ReviewMetricType {
    rating: number;
    count: number;
}
 

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  product: {
    title: string;
    images: string[];
  };
}
