import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

export interface TicketFilters {
  status?: string;
  dateRange?: DateRange;
  location?: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

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

export function useGetTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: [QUERY_KEY.tickets, filters],
    queryFn: () => getTickets(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      // Don't retry on network errors or 4xx errors
      if (error?.message?.includes('Network Error')) {
        return false;
      }
      // Check if it's an axios error with response
      if (error && 'response' in error && error.response && 
          typeof error.response === 'object' && 'status' in error.response) {
        const status = (error.response as any).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}