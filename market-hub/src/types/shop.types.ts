export interface Shop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating?: number;
  reviews?: number;
  productCount?: number;
  isVerified?: boolean;
  isActive?: boolean;
  categories?: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopResponse {
  data: Shop[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ShopFilter {
  category?: string;
  location?: string;
  rating?: number;
  verified?: boolean;
  search?: string;
  sortBy?: 'rating' | 'newest' | 'popular' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}