import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/queryKeys";
import APICall from "@/utils/ApiCall";
import { AxiosError } from "axios";

async function fetchCategoryProducts(categoryId: string | number) {
  try {
    const response = await APICall(`/category/products/${categoryId}`, "GET");
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

export function useCategoryProducts(categoryId: string | number | undefined | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.categoryProducts, categoryId],
    queryFn: () => fetchCategoryProducts(categoryId as string | number),
    enabled: !!categoryId, // Only fetch when categoryId is truthy
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.categoryProducts, categoryId]);
    },
  });

  return query;
}
