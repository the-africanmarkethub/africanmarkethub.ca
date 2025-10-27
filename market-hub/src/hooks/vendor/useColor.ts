import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export async function fetchColors() {
  const res = await APICall("/admin/colors", "GET");
  console.log(res, "res");
  return res.data;
}

function useColor() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.color],
    queryFn: fetchColors,
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.color]);
    },
  });

  return query;
}

export default useColor;
