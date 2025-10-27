export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryId?: string;
  stock: number;
  rating?: number;
  reviews?: number;
  vendor?: {
    id: string;
    name: string;
    shopName: string;
  };
  specifications?: Record<string, any>;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isAvailable?: boolean;
  discount?: number;
  colors?: Color[];
  sizes?: string[];
}

export interface Color {
  id: string;
  name: string;
  code: string;
  images?: string[];
}

export interface ProductResponse {
  data: Product[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SearchResponse {
  message: string;
  status: number;
  data: Product[];
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  vendor?: string;
  search?: string;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  color?: Color;
  size?: string;
  price: number;
  subtotal: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}