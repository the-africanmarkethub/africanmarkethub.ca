"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CustomerLocation {
  city: string;
  country: string;
  total_customers: number;
  percentage: number;
}

interface TopCustomerLocationsResponse {
  status: string;
  data: CustomerLocation[];
}

const fetchTopCustomerLocations = async (): Promise<TopCustomerLocationsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/top-customer-locations`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top customer locations");
  }

  return response.json();
};

export const useVendorTopCustomerLocations = () => {
  return useQuery({
    queryKey: ["vendor-top-customer-locations"],
    queryFn: fetchTopCustomerLocations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};