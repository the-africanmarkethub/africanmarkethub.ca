import { QUERY_KEY } from "@/constants/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

// API function to fetch products
export async function getReviews() {
  try {
    const url = "/reviews";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch products
export function useGetReviews() {
  return useQuery({
    queryKey: [QUERY_KEY.reviews],
    queryFn: () => getReviews(),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
