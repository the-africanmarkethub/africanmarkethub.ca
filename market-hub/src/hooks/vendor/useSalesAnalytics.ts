import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getSalesAnalytics() {
  try {
    const url = "/vendor/sales-analytics";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSalesAnalytics() {
  return useQuery({
    queryKey: [QUERY_KEY.salesAnalytics],
    queryFn: () => getSalesAnalytics(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
