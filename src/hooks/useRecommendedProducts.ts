"use client";

import { useQuery } from "@tanstack/react-query";
import { RecommendedProductsResponse } from "@/types/product";
import { QueryKeys } from "@/lib/query-keys";

const fetchRecommendedProducts =
  async (): Promise<RecommendedProductsResponse> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      throw new Error("API base URL is not configured");
    }

    const response = await fetch(`${baseUrl}/products/recommended`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch recommended products: ${response.statusText}`
      );
    }

    return response.json();
  };

export const useRecommendedProducts = () => {
  return useQuery({
    queryKey: QueryKeys.RECOMMENDED_PRODUCTS,
    queryFn: fetchRecommendedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
