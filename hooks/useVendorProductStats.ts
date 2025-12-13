"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProductStatistics {
  total_products: number;
  active_products: number;
  inactive_products: number;
  reviewed_products: number;
  ordered_products: number;
  views: string;
}

interface ProductStatisticsResponse {
  status: string;
  data: ProductStatistics;
}

const fetchProductStatistics = async (): Promise<ProductStatisticsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/items/statistics`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product statistics");
  }

  return response.json();
};

export const useVendorProductStats = () => {
  return useQuery({
    queryKey: ["vendorProductStats"],
    queryFn: fetchProductStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};