import { useQuery } from "@tanstack/react-query";
import { ShopsResponse } from "@/types/customer/shop.types";
import ApiCall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

const fetchShops = async (): Promise<ShopsResponse> => {
  const response = await ApiCall("/shops", "GET");
  return response;
};

export const useShops = () => {
  return useQuery({
    queryKey: [QUERY_KEY.shops],
    queryFn: fetchShops,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
