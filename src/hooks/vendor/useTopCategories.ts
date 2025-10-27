import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getTopCategories() {
  try {
    const url = "/vendor/top-categories";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useTopCategories() {
  return useQuery({
    queryKey: [QUERY_KEY.category, "top"],
    queryFn: () => getTopCategories(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}