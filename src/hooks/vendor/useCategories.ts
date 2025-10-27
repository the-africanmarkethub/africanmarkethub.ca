import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type CategoryType = "products" | "services";

interface UseCategoriesOptions {
  type?: CategoryType;
}

export async function fetchCategories(type: CategoryType = "products") {
  const res = await APICall(`/categories?type=${type}`, "GET");
  
  // The API returns categories in a 'categories' field
  return res.categories || res.data || [];
}

function useCategories(options?: UseCategoriesOptions) {
  const queryClient = useQueryClient();
  const type = options?.type || "products";

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
