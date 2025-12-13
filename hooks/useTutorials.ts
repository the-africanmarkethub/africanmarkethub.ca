"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Tutorial {
  id: number;
  title: string;
  description: string;
  video_url: string | null;
  image_url: string;
  image_public_id: string;
  type: "customer" | "vendor";
  status: string;
  created_at: string;
  updated_at: string;
}

interface TutorialResponse {
  status: string;
  data: Tutorial[];
  total: number;
  limit: number;
  offset: number;
}

const fetchTutorials = async (
  type: "customer" | "vendor"
): Promise<TutorialResponse> => {
  const response = await fetch(`${API_BASE_URL}/tutorials?type=${type}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tutorials");
  }

  return response.json();
};

export const useTutorials = (type: "customer" | "vendor" = "customer") => {
  return useQuery({
    queryKey: ["tutorials", type],
    queryFn: () => fetchTutorials(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCustomerTutorials = () => {
  return useTutorials("customer");
};

export const useVendorTutorials = () => {
  return useTutorials("vendor");
};
