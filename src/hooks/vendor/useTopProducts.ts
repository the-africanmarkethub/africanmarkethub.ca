import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getTopProducts() {
  try {
    const url = "/vendor/top-products";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useTopProducts() {
  return useQuery({
    queryKey: [QUERY_KEY.products, "top"],
    queryFn: () => getTopProducts(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}