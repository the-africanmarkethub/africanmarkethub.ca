import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/queryKeys";
import { getColors } from "@/services/sizesColorsService";
import { ColorsResponse } from "@/types/product.types";

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
