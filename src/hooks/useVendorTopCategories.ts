"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TopCategory {
  category: string;
  quantity_sold: number;
  revenue: number;
}

interface TopCategoriesResponse {
  status: string;
  data: TopCategory[];
}

const fetchTopCategories = async (): Promise<TopCategoriesResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/top-categories`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch top categories");
  }

  return response.json();
};

export const useVendorTopCategories = () => {
  return useQuery({
    queryKey: ["vendor-top-categories"],
    queryFn: fetchTopCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};