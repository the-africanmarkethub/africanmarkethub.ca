import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";

export async function getTopCustomerLocations() {
  try {
    const url = "/vendor/top-customer-locations";
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useTopCustomerLocations() {
  return useQuery({
    queryKey: [QUERY_KEY.location, "top-customers"],
    queryFn: () => getTopCustomerLocations(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}