import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

// API function to fetch sales details
export async function getSalesDetails() {
  try {
    const url = "vendor/graphy";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch sales details
export function useGetSalesDeatils() {
  return useQuery({
    queryKey: [QUERY_KEY.salesDetails],
    queryFn: () => getSalesDetails(),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
