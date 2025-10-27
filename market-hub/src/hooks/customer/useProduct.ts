import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";

async function fetchProduct(productSlug: string | number) {
  const response = await APICall(`/product/${productSlug}`, "GET");
  return response.data;
}

export function useProduct(productSlug: string | number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.products, productSlug],
    queryFn: () => fetchProduct(productSlug),
    initialData: () =>
      queryClient.getQueryData([QUERY_KEY.products, productSlug]),
    staleTime: 1000 * 60 * 5, // 5 minutes cache duration
    enabled: !!productSlug,
  });

  return query;
}
