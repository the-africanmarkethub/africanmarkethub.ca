"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SalesDataPoint {
  date: string;
  total: string;
}

interface VendorGraphyResponse {
  status: string;
  data: SalesDataPoint[];
}

const fetchVendorGraphy = async (): Promise<VendorGraphyResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/graphy`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor sales data");
  }

  return response.json();
};

export const useVendorGraphy = () => {
  return useQuery({
    queryKey: ["vendor-graphy"],
    queryFn: fetchVendorGraphy,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};