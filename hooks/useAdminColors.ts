"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Color {
  id: number;
  name: string;
  hexcode: string;
  created_at: string;
  updated_at: string;
}

interface ColorsResponse {
  status: string;
  message: string;
  data: Color[];
}

const fetchAdminColors = async (): Promise<ColorsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  const response = await fetch(`${API_BASE_URL}/admin/colors`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch colors");
  }

  return response.json();
};

export const useAdminColors = () => {
  return useQuery({
    queryKey: ["adminColors"],
    queryFn: fetchAdminColors,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export type { Color };