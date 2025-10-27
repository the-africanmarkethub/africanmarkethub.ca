import { useQuery, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

async function fetchSubcription() {
  try {
    const response = await APICall(`/subscriptions`, "GET");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useSubcription() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.subcription],
    queryFn: fetchSubcription,
    initialData: () => queryClient.getQueryData([QUERY_KEY.subcription]),
  });

  return query;
}
