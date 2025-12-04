"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TopProduct {
  product_id: number;
  title: string;
  image: string;
  quantity_sold: number;
  revenue: number;
}

interface TopProductsResponse {
  status: string;
  data: TopProduct[];
}

const fetchTopProducts = async (): Promise<TopProductsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/top-products`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top products");
  }

  return response.json();
};

export const useVendorTopProducts = () => {
  return useQuery({
    queryKey: ["vendor-top-products"],
    queryFn: fetchTopProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};