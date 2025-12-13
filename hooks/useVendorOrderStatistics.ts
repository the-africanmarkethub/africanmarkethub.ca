"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface VendorOrderStatistics {
  total_orders: number;
  new_orders: number;
  ongoing_orders: number;
  shipped_orders: number;
  cancelled_orders: number;
  returned_orders: number;
}

interface VendorOrderStatisticsResponse {
  status: string;
  data: VendorOrderStatistics;
}

const fetchVendorOrderStatistics = async (): Promise<VendorOrderStatisticsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/order/statistics`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor order statistics");
  }

  return response.json();
};

export const useVendorOrderStatistics = () => {
  return useQuery({
    queryKey: ["vendor-order-statistics"],
    queryFn: fetchVendorOrderStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};