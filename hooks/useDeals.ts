"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Deal {
  id: number;
  discount_code: string;
  product_id: number;
  vendor_id: number;
  start_time: string;
  end_time: string;
  discount_rate: string;
  discount_type: "fixed" | "percentage";
  notify_users: number;
  status: string;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    sales_price: string;
    regular_price: string;
    quantity: number;
    images: string[];
    status: string;
    type: string;
    average_rating: number;
    variations: any[];
  };
}

interface DealsResponse {
  status: string;
  message: string;
  data: Deal[];
  total_time_left: string;
}

const fetchDeals = async (): Promise<DealsResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/deals`);

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  return response.json();
};

export const useDeals = () => {
  return useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for countdown
  });
};