"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProductVariation {
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

interface Category {
  id: number;
  name: string;
  type: string;
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

export interface VendorProduct {
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
  status: string;
  type: string;
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
  category: Category;
  shop: Shop;
  average_rating: number;
  variations: ProductVariation[];
}

interface VendorProductsResponse {
  data: {
    current_page: number;
    data: VendorProduct[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  status: string;
  message: string;
}

const fetchVendorProducts = async (page: number = 1, perPage: number = 7, type: string = "products"): Promise<VendorProductsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/vendor/items?type=${type}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor products");
  }

  return response.json();
};

export const useVendorProducts = (page: number = 1, perPage: number = 7, type: string = "products") => {
  return useQuery({
    queryKey: ["vendorProducts", page, perPage, type],
    queryFn: () => fetchVendorProducts(page, perPage, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};