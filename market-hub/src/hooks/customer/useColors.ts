import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import { getColors } from "@/services/sizesColorsService";
import { ColorsResponse } from "@/types/customer/product.types";

// Hook to get all colors
export function useColors(
  options?: Omit<UseQueryOptions<ColorsResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery<ColorsResponse, Error>({
    queryKey: [QUERY_KEY.colors],
    queryFn: getColors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}
