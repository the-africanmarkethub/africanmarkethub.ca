import { useQuery } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

// Types for the API response
interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  features: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  notify_user: number;
  images: string[];
  image_public_ids: string[];
  status: string;
  type: string;
  shop_id: number;
  category_id: number;
  views: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    image: string | null;
    image_public_id: string | null;
    slug: string;
    description: string;
    status: string;
    parent_id: string;
    created_at: string;
    updated_at: string;
  };
  shop: {
    id: number;
    name: string;
    slug: string;
    address: string;
    type: string;
    logo: string;
    logo_public_id: string;
    banner: string;
    banner_public_id: string;
    description: string;
    subscription_id: number;
    state_id: string;
    city_id: string;
    country_id: string;
    vendor_id: number;
    category_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  average_rating: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ProductsResponse {
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  status: string;
  message: string;
}

interface ProductsParams {
  type?: "products" | "services";
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
}

// API function to fetch products
export async function getProducts(params: ProductsParams = {}) {
  try {
    const queryParams = new URLSearchParams();

    // Set default type to products if not specified
    queryParams.set("type", params.type || "products");

    // Add optional parameters
    if (params.search) queryParams.set("search", params.search);
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params.status) queryParams.set("status", params.status);
    if (params.category) queryParams.set("category", params.category);

    const url = `/vendor/items?${queryParams.toString()}`;
    const response = await APICall(url, "GET");
    
    // Handle the case where API returns error status but with data
    if (response && response.status === "error" && response.data) {
      // Return the response even if status is error, since data structure is still valid
      return response as ProductsResponse;
    }
    
    return response as ProductsResponse;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch products
export function useGetProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY.products, params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}

// Convenience hooks for common use cases
export function useSearchProducts(search: string, page?: number) {
  return useGetProducts({ search, page, type: "products" });
}

export function useGetProductsByPage(page: number) {
  return useGetProducts({ page, type: "products" });
}

export function useGetProductsByCategory(category: string, page?: number) {
  return useGetProducts({ category, page, type: "products" });
}
