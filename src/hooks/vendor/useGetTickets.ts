import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";
import { type TicketFilters } from "@/components/vendor/vendor-support/ticketing-table";

// API function to fetch products
export async function getTickets(filters?: TicketFilters) {
  try {
    let url = `/tickets`;
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }

    if (filters?.location && filters.location !== "all") {
      params.append("location", filters.location);
    }

    if (filters?.dateRange?.from) {
      params.append("fromDate", filters.dateRange.from.toISOString());
    }

    if (filters?.dateRange?.to) {
      params.append("toDate", filters.dateRange.to.toISOString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await APICall(url, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

// React Query hook to fetch products
export function useGetTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: [QUERY_KEY.ticket, filters],
    queryFn: () => getTickets(filters),
    staleTime: 1000 * 60 * 5, // Data will be considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });
}
