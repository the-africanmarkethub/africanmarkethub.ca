import { QUERY_KEY } from "@/constants/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

// API function to fetch orders
export async function getOrders(page?: number) {
  try {
    const url = typeof page === "number" ? `orders?page=${page}` : "orders";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch orders
export function useGetOrders(page?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.order, page],
    queryFn: () => getOrders(page),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
