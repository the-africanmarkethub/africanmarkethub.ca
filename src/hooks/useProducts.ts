import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/queryKeys";
import APICall from "@/utils/ApiCall";

async function fetchProducts(type: string = "products", page: string = "1") {
  const response = await APICall(`/items?type=${type}&page=${page}`, "GET");
  return response;
}

export function useProducts(type: string = "products", page: string = "1") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.products, type, page],
    queryFn: () => fetchProducts(type, page),
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.products, type, page]);
    },
  });

  return query;
}
