import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/authService";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

export const useUser = () => {
  const query = useQuery({
    queryKey: [QUERY_KEY.user],
    queryFn: getCurrentUser,
  });

  return query;
};
