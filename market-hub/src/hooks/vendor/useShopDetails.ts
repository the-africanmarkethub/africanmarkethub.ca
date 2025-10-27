import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getShopDetails() {
  try {
    const url = "/vendor/shop";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useShopDetails() {
  return useQuery({
    queryKey: [QUERY_KEY.shopDetails],
    queryFn: () => getShopDetails(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}