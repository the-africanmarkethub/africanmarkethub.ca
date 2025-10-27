import { useQuery } from "@tanstack/react-query";
import { getAddresses, Address } from "@/services/addressService";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import { getAuthToken } from "@/utils/header";

interface AddressesResponse {
  data: Address[];
  message?: string;
}

export function useAddresses() {
  const token = typeof window !== "undefined" ? getAuthToken() : null;

  return useQuery<AddressesResponse>({
    queryKey: [QUERY_KEY.address],
    queryFn: getAddresses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!token, // Only run query if token exists
  });
}