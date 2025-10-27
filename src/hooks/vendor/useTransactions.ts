import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getTransactions() {
  try {
    const url = "/vendor/transactions";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useTransactions() {
  return useQuery({
    queryKey: [QUERY_KEY.transactions],
    queryFn: () => getTransactions(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}