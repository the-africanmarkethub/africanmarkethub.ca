import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateTicketData {
  service_id: string;
  title: string;
  subject: string;
  description: string;
  priority_level?: "low" | "medium" | "high";
  response_status?: "open" | "close" | "ongoing";
  file?: File;
}

export interface CreateTicketResponse {
  success: boolean;
  data: {
    ticket_id: string;
    service_id: string;
    title: string;
    subject: string;
    description: string;
    priority_level: string;
    response_status: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

async function createTicket(
  ticketData: CreateTicketData
): Promise<CreateTicketResponse> {
  try {
    const formData = new FormData();

    formData.append("service_id", ticketData.service_id);
    formData.append("title", ticketData.title);
    formData.append("subject", ticketData.subject);
    formData.append("description", ticketData.description);

    if (ticketData.priority_level) {
      formData.append("priority_level", ticketData.priority_level);
    }

    if (ticketData.response_status) {
      formData.append("response_status", ticketData.response_status);
    }

    if (ticketData.file) {
      formData.append("file", ticketData.file);
    }

    const response = await APICall("/ticket/create", "POST", formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ticket] });
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
    },
  });
}
