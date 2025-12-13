"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface VendorEarnings {
  id: number;
  user_id: number;
  total_earning: number;
  available_to_withdraw: number;
  pending: string;
}

interface VendorEarningsResponse {
  status: string;
  data: VendorEarnings;
}

const fetchVendorEarnings = async (): Promise<VendorEarningsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/earnings`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor earnings");
  }

  return response.json();
};

export const useVendorEarnings = () => {
  return useQuery({
    queryKey: ["vendor-earnings"],
    queryFn: fetchVendorEarnings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};