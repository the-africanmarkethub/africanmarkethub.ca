"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SalesAnalytics {
  sales_volume: number;
  sales_growth: number;
  conversion_rate: number;
  conversion_growth: number;
  profit_margin: number;
  profit_growth: number;
}

interface SalesAnalyticsResponse {
  status: string;
  data: SalesAnalytics;
}

const fetchSalesAnalytics = async (): Promise<SalesAnalyticsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/sales-analytics`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales analytics");
  }

  return response.json();
};

export const useVendorSalesAnalytics = () => {
  return useQuery({
    queryKey: ["vendor-sales-analytics"],
    queryFn: fetchSalesAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};