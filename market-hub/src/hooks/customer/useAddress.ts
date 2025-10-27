import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "@/services/authService";
import { getAuthToken } from "@/utils/header";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

export function useAddress() {
  const token = typeof window !== "undefined" ? getAuthToken() : null;

  return useQuery({
    queryKey: [QUERY_KEY.address],
    queryFn: getAddresses,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
