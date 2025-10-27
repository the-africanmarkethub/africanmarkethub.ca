import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getSalesGraph() {
  try {
    const url = "/vendor/graphy";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSalesGraph() {
  return useQuery({
    queryKey: [QUERY_KEY.salesGraph],
    queryFn: () => getSalesGraph(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}