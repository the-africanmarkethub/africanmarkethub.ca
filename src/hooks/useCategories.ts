"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Category {
  id: number;
  name: string;
  type: "products" | "services";
  image: string;
  image_public_id: string;
  slug: string;
  description: string;
  status: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoriesResponse {
  message: string;
  status: string;
  banner: string | null;
  categories: Category[];
}

const fetchCategories = async (type: "products" | "services"): Promise<CategoriesResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories?type=${type}`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const useCategories = (type: "products" | "services") => {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => fetchCategories(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductCategories = () => {
  return useCategories("products");
};

export const useServiceCategories = () => {
  return useCategories("services");
};