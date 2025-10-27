import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getTransactions(page?: number) {
  try {
    const url =
      typeof page === "number"
        ? `vendor/transactions?page=${page}`
        : "/vendor/transactions";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useGetTransactions(page?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.transactions, page],
    queryFn: () => getTransactions(),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
