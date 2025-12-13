export interface Product {
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
  status: "active" | "inactive";
  type: "products" | "services";
  shop_id: number;
  category_id: number;
  views: number;
  pricing_model: string | null;
  sku: string;
  delivery_method: string | null;
  estimated_delivery_time: string | null;
  available_days: string[] | null;
  available_from: string | null;
  available_to: string | null;
  created_at: string;
  updated_at: string;
  height: string;
  width: string;
  length: string;
  weight: string;
  size_unit: string | null;
  weight_unit: string;
  average_rating: number;
  variations: ProductVariation[];
}

export interface ProductVariation {
  id: number;
  product_id: number;
  size_id: number;
  color_id: number;
  price: string;
  quantity: number;
  sku: string;
  created_at: string;
  updated_at: string;
  color: {
    id: number;
    name: string;
    hexcode: string;
    created_at: string;
    updated_at: string;
  };
  size: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface RecommendedProductsResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ShopInfo {
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

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface StarRating {
  total: number;
  reviews: Review[];
}

export interface ProductDetailResponse {
  status: string;
  message: string;
  data: {
    product: Product & {
      category: {
        id: number;
        name: string;
        type: string;
        image: string;
        image_public_id: string;
        slug: string;
        description: string;
        status: string;
        parent_id: number | null;
        created_at: string;
        updated_at: string;
      };
      shop: ShopInfo;
      reviews: Review[];
    };
    star_rating: StarRating;
    frequently_bought_together: Product[];
    recommended: Product[];
    otherViews: Product[];
  };
}
