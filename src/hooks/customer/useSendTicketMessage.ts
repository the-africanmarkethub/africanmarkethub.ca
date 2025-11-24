import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

export interface SendMessageData {
  ticket_id: string;
  service_id: string;
  title?: string;
  subject?: string;
  description: string;
  priority_level?: string;
  response_status?: string;
  file?: File;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data?: any;
}

async function sendTicketMessage(messageData: SendMessageData): Promise<SendMessageResponse> {
  try {
    const formData = new FormData();
    
    // Include required fields for updating existing ticket
    formData.append("ticket_id", messageData.ticket_id);
    formData.append("service_id", messageData.service_id);
    formData.append("description", messageData.description);
    
    if (messageData.title) {
      formData.append("title", messageData.title);
    }
    
    if (messageData.subject) {
      formData.append("subject", messageData.subject);
    }
    
    if (messageData.priority_level) {
      formData.append("priority_level", messageData.priority_level);
    }
    
    if (messageData.response_status) {
      formData.append("response_status", messageData.response_status);
    }
    
    if (messageData.file) {
      formData.append("file", messageData.file);
    }

    // Use the same /ticket/create endpoint but with ticket_id to update
    const response = await APICall("/ticket/create", "POST", formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useSendTicketMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendTicketMessage,
    onSuccess: (_, variables) => {
      // Invalidate and refetch the specific ticket details
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEY.tickets, "details", variables.ticket_id] 
      });
      // Also invalidate the tickets list to update last message
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEY.tickets] 
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });
}