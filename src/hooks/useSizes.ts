import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/queryKeys";
import { getSizes } from "@/services/sizesColorsService";
import { SizesResponse } from "@/types/product.types";

// Hook to get all sizes
export function useSizes(
  options?: Omit<UseQueryOptions<SizesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery<SizesResponse, Error>({
    queryKey: [QUERY_KEY.sizes],
    queryFn: getSizes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}
