import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "@/constants/queryKeys";
import { Shop, ShopsApiResponse } from "@/types/shop.types";
import { Base_URL } from "@/utils/ApiCall";

async function fetchShops(): Promise<Shop[]> {
  const url = `${Base_URL}/shops`;
  try {
    const response = await axios.get<ShopsApiResponse>(url);
    // The API wraps the array in a nested structure, so we extract it here.
    return response.data.shops.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error fetching shops:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error("Error fetching shops:", error);
    }
    throw error;
  }
}

export function useShops() {
  return useQuery<Shop[]>({
    queryKey: [QUERY_KEY.shops],
    queryFn: fetchShops,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
