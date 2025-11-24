import APICall from "@/utils/ApiCall";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

export interface VendorTicketMessage {
  sender: "customer" | "support";
  message: string;
  file: string | null;
  timestamp: string;
}

export interface VendorTicketDetails {
  ticket_id: string;
  subject: string;
  priority_level: "low" | "medium" | "high";
  response_status: "open" | "close" | "ongoing";
  created_at: string;
  updated_at: string;
  user_detail: {
    full_name: string;
    profile_photo: string;
    online_status: "online" | "offline";
  };
  service_detail: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  messages: VendorTicketMessage[];
}

export async function getVendorTicketDetails(ticketId: string) {
  try {
    const response = await APICall(`/ticket/${ticketId}/show`, "GET");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useGetVendorTicketDetails(ticketId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.ticket, "details", ticketId],
    queryFn: () => getVendorTicketDetails(ticketId!),
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}