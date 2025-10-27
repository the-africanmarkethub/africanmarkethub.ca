import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

// API function to fetch products
export async function getShopDetails() {
  try {
    const url = "/vendor/shop";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch products
export function useGetShopDetails() {
  return useQuery({
    queryKey: [QUERY_KEY.shop],
    queryFn: () => getShopDetails(),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
