import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getProductStatistics() {
  try {
    const url = "/vendor/items/statistics";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useProductStatistics() {
  return useQuery({
    queryKey: [QUERY_KEY.products, "statistics"],
    queryFn: () => getProductStatistics(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}