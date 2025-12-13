"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Size {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface SizesResponse {
  status: string;
  message: string;
  data: Size[];
}

const fetchAdminSizes = async (): Promise<SizesResponse> => {
  const token = localStorage.getItem("auth_token");
  
  const response = await fetch(`${API_BASE_URL}/admin/sizes`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sizes");
  }

  return response.json();
};

export const useAdminSizes = () => {
  return useQuery({
    queryKey: ["adminSizes"],
    queryFn: fetchAdminSizes,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export type { Size };