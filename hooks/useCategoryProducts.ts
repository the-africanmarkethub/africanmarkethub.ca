"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CategoryFilters {
  min_price?: number;
  max_price?: number;
  category_id?: number;
  size_id?: number;
  rating?: number;
  availability?: string;
  location?: string;
  page?: number;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  images: string[];
  status: string;
  type: string;
  category_id: number;
  views: number;
  sku: string;
  average_rating: number;
  variations: any[];
}

interface CategoryProductsResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  category: {
    id: number;
    name: string;
    type: string;
    image: string;
    slug: string;
    description: string;
  };
}

const fetchCategoryProducts = async (
  categoryId: number,
  type: "products" | "services",
  filters: CategoryFilters = {}
): Promise<CategoryProductsResponse> => {
  const params = new URLSearchParams();

  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const queryString = params.toString();
  const url = `${API_BASE_URL}/category/products/${categoryId}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  return response.json();
};

export const useCategoryProducts = (
  categoryId: number,
  type: "products" | "services" = "products",
  filters: CategoryFilters = {}
) => {
  return useQuery({
    queryKey: ["category-products", categoryId, type, filters],
    queryFn: () => fetchCategoryProducts(categoryId, type, filters),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
