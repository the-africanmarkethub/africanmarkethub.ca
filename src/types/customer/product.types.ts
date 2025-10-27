// Product related interfaces
export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  features: string;
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
  views: number;
  created_at: string;
  updated_at: string;
  category: Category;
  shop: Shop;
  variations: Variation[];
  reviews: Review[];
  average_rating: number;
}

interface Category {
  id: number;
  name: string;
  image: string;
  image_public_id: string;
  slug: string;
  description: string;
  status: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

interface Shop {
  id: number;
  name: string;
  slug: string;
  address: string;
  type: string;
  logo: string;
  logo_public_id: string;
  banner: string;
  banner_public_id: string;
  description: string;
  subscription_id: number;
  state_id: string;
  city_id: string;
  country_id: string;
  vendor_id: number;
  category_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Variation {
  id: number;
  product_id: number;
  size_id: number | null;
  color_id: number | null;
  price: string;
  quantity: number;
  sku: string;
  created_at: string;
  updated_at: string;
  color: Color | null;
  size: Size | null;
}

interface Review {
  star: string;
  // Empty in the provided data, but included for completeness
  // This would typically include fields like id, rating, comment, user_id, etc.
}

interface StarRating {
  total: number;
  reviews: Review[];
}

// Size and Color interfaces
export interface Size {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Color {
  id: number;
  name: string;
  hexcode: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface SizesResponse {
  data: Size[];
  status: string;
  message: string;
}

export interface ColorsResponse {
  data: Color[];
  status: string;
  message: string;
}

// Main data structure from the JSON
export interface ProductData {
  //   json: {
  product: Product;
  star_rating: StarRating;
  frequently_bought_together: Product[];
  recommended: Product[];
  otherViews: Product[];
  //   };
}
