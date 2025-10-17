import { QUERY_KEY } from "@/constants/queryKeys";
import { fetchCategories } from "@/services/homeService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function useCategories(type: string = "products") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.category, type],
    queryFn: () => fetchCategories(type),
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.category, type]);
    },
  });

  return query;
}

export default useCategories;
