"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";
import { ProductDetailResponse } from "@/types/product";

const fetchProductDetail = async (
  slug: string
): Promise<ProductDetailResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${baseUrl}/product/${slug}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.statusText}`);
  }

  return response.json();
};

export const useProductDetail = (slug: string) => {
  return useQuery({
    queryKey: QueryKeys.PRODUCT_DETAILS(slug),
    queryFn: () => fetchProductDetail(slug),
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
