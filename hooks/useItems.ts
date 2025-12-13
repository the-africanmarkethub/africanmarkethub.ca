"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemsResponse, ItemsPayload } from "@/types/items";
import { QueryKeys } from "@/lib/query-keys";

const fetchItems = async ({
  type,
  page = 1,
  limit = 20,
}: ItemsPayload): Promise<ItemsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const params = new URLSearchParams({
    type: type,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${baseUrl}/items?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch items: ${response.statusText}`);
  }

  return response.json();
};

export const useItems = ({ type, page = 1, limit = 20 }: ItemsPayload) => {
  return useQuery({
    queryKey: QueryKeys.ITEMS(type, page, limit),
    queryFn: () => fetchItems({ type, page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};