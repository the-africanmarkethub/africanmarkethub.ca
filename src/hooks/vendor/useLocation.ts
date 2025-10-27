import { useQuery, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

async function fetchLocation() {
  try {
    const response = await APICall(`/location`, "GET");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useLocation() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.location],
    queryFn: fetchLocation,
    initialData: () => queryClient.getQueryData([QUERY_KEY.location]),
  });

  return query;
}
