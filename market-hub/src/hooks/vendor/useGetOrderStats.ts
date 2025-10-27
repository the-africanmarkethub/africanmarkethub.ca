import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getOrderStats() {
  try {
    const url = "/vendor/order/statistics";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useGetOrderStats() {
  return useQuery({
    queryKey: [QUERY_KEY.orderStats],
    queryFn: () => getOrderStats(),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
