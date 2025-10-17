import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/authService";
import { getAuthToken } from "@/utils/header";
import { QUERY_KEY } from "@/constants/queryKeys";

export function useGetProfile() {
  const token = typeof window !== "undefined" ? getAuthToken() : null;


  return useQuery({
    queryKey: [QUERY_KEY.profile],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!token, // Only run query if token exists
  });
}
