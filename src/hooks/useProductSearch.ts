"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchResponse, SearchPayload } from "@/types/search";
import { QueryKeys } from "@/lib/query-keys";

const fetchProductSearch = async ({
  query,
  page = 1,
  per_page = 20,
}: SearchPayload): Promise<SearchResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${baseUrl}/product/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      page: page,
      per_page: per_page,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }

  return response.json();
};

export const useProductSearch = ({
  query,
  page = 1,
  per_page = 20,
}: SearchPayload) => {
  return useQuery({
    queryKey: QueryKeys.PRODUCT_SEARCH(query, page),
    queryFn: () => fetchProductSearch({ query, page, per_page }),
    enabled: !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
