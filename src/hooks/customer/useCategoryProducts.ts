import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";
import { AxiosError } from "axios";

interface FilterParams {
  min_price?: number;
  max_price?: number;
  category_id?: number;
  size_id?: number;
  rating?: number;
  availability?: string;
  location?: string;
}

async function fetchCategoryProducts(categoryId: string | number, queryParams?: FilterParams) {
  try {
    const params = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    const url = `/category/products/${categoryId}${queryString ? `?${queryString}` : ''}`;
    const response = await APICall(url, "GET");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (
      axiosError.response?.status === 404 &&
      axiosError.response?.data?.message === "No products found"
    ) {
      // This is a valid empty state, not a true error.
      // Return a structure that the UI can understand as "empty".
      return { products: { data: [], message: "No products found" } };
    }
    // For all other errors, re-throw them so React Query can handle them.
    throw error;
  }
}

export function useCategoryProducts(
  categoryId: string | number | undefined | null,
  queryParams?: FilterParams
) {
  const queryClient = useQueryClient();

  console.log("🔍 useCategoryProducts called:", {
    categoryId,
    queryParams,
    enabled: !!categoryId,
    type: typeof categoryId
  });

  const query = useQuery({
    queryKey: [QUERY_KEY.categoryProducts, categoryId, queryParams],
    queryFn: () => {
      console.log("📡 Fetching category products for:", categoryId);
      return fetchCategoryProducts(categoryId as string | number, queryParams);
    },
    enabled: !!categoryId, // Only fetch when categoryId is truthy
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.categoryProducts, categoryId]);
    },
  });

  console.log("📊 useCategoryProducts result:", {
    isLoading: query.isLoading,
    isError: query.isError,
    hasData: !!query.data,
    error: query.error
  });

  return query;
}
