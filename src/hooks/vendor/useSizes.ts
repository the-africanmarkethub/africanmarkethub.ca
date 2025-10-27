import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export async function fetchSizes() {
  const res = await APICall("/admin/sizes", "GET");
  return res.data;
}

function useSizes() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.size],
    queryFn: fetchSizes,
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.size]);
    },
  });

  return query;
}

export default useSizes;
