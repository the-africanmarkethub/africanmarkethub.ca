"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Product {
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
  average_rating: number;
  variations: any[];
  reviews?: any[];
}

export interface VendorDiscount {
  id: number;
  discount_code: string;
  product_id: number;
  vendor_id: number;
  start_time: string;
  end_time: string;
  discount_rate: string;
  discount_type: "percentage" | "fixed";
  notify_users: number;
  status: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface VendorDiscountsResponse {
  status: string;
  message: string;
  data: VendorDiscount[];
}

const fetchVendorDiscounts = async (page: number = 1, perPage: number = 10): Promise<VendorDiscountsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/vendor/discounts?page=${page}&per_page=${perPage}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor discounts");
  }

  return response.json();
};

export const useVendorDiscounts = (page: number = 1, perPage: number = 10) => {
  return useQuery({
    queryKey: ["vendorDiscounts", page, perPage],
    queryFn: () => fetchVendorDiscounts(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};