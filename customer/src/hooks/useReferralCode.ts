import { useQuery } from "@tanstack/react-query";
import { getReferralCode } from "@/services/referralService";
import { QUERY_KEY } from "@/constants/queryKeys";

export const useReferralCode = () => {
  const query = useQuery({
    queryKey: [QUERY_KEY.referralCode],
    queryFn: getReferralCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};