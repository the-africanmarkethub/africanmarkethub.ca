import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/queryKeys";
import APICall from "@/utils/ApiCall";

interface RecommendedProductsParams {
  page?: number;
}

async function fetchRecommendedProducts({
  page = 1,
}: RecommendedProductsParams = {}) {
  const response = await APICall(`/products/recommended?page=${page}`, "GET");
  return response;
}

export function useRecommendedProducts(params: RecommendedProductsParams = {}) {
  const { page = 1 } = params;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.recommendedProducts, page],
    queryFn: () => fetchRecommendedProducts({ page }),
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.recommendedProducts, page]);
    },
  });

  return query;
}
