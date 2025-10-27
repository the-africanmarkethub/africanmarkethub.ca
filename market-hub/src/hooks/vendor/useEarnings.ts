import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getEarnings() {
  try {
    const url = "/vendor/earnings";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useEarnings() {
  return useQuery({
    queryKey: [QUERY_KEY.wallet, "earnings"],
    queryFn: () => getEarnings(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}