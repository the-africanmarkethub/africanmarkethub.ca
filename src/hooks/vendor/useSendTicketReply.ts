import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import { toast } from "sonner";

export interface VendorReplyData {
  ticket_id: string;
  service_id: string;
  description: string;
  file?: File;
}

export interface VendorReplyResponse {
  success: boolean;
  message: string;
  data?: any;
}

async function sendVendorReply(replyData: VendorReplyData): Promise<VendorReplyResponse> {
  try {
    const formData = new FormData();
    
    // Include required fields for updating existing ticket
    formData.append("ticket_id", replyData.ticket_id);
    formData.append("service_id", replyData.service_id);
    formData.append("description", replyData.description);
    
    if (replyData.file) {
      formData.append("file", replyData.file);
    }

    // Use the same /ticket/create endpoint but with ticket_id to update
    const response = await APICall("/ticket/create", "POST", formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSendVendorTicketReply() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendVendorReply,
    onSuccess: (response, variables) => {
      // Invalidate and refetch the specific ticket details
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEY.ticket, "details", variables.ticket_id] 
      });
      // Also invalidate the tickets list to update last message
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEY.ticket] 
      });
      
      // Also invalidate customer-side queries if they exist
      queryClient.invalidateQueries({ 
        queryKey: ["tickets", "details", variables.ticket_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["tickets"] 
      });
      
      toast.success("Reply sent successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to send reply. Please try again.";
      toast.error(errorMessage);
    },
  });
}