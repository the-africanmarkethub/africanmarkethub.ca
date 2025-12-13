"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Color {
  id: number;
  name: string;
  hexcode: string;
}

interface Size {
  id: number;
  name: string;
}

interface ProductOptions {
  colors: Color[];
  sizes: Size[];
}

const fetchProductOptions = async (): Promise<ProductOptions> => {
  const token = localStorage.getItem("auth_token");
  
  const [colorsResponse, sizesResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/colors`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
    fetch(`${API_BASE_URL}/sizes`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    }),
  ]);

  if (!colorsResponse.ok || !sizesResponse.ok) {
    throw new Error("Failed to fetch product options");
  }

  const colorsData = await colorsResponse.json();
  const sizesData = await sizesResponse.json();

  return {
    colors: colorsData.data || colorsData.colors || [],
    sizes: sizesData.data || sizesData.sizes || [],
  };
};

export const useProductOptions = () => {
  return useQuery({
    queryKey: ["productOptions"],
    queryFn: fetchProductOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export type { Color, Size };