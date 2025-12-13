"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types based on the API responses
export interface TicketUser {
  full_name: string;
  profile_photo: string;
  online_status: "online" | "offline";
}

export interface ServiceDetail {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface TicketMessage {
  sender: "customer" | "vendor";
  message: string;
  file: string | null;
  timestamp: string;
}

export interface Ticket {
  ticket_id: string;
  service_id: number;
  full_name: string;
  profile_photo: string;
  last_message: string;
  last_message_time: string;
  online_status: "online" | "offline";
}

export interface TicketDetail {
  ticket_id: string;
  subject: string;
  priority_level: "low" | "medium" | "high";
  response_status: "open" | "closed";
  created_at: string;
  updated_at: string;
  user_detail: TicketUser;
  service_detail: ServiceDetail;
  messages: TicketMessage[];
}

export interface CreateTicketPayload {
  service_id: number;
  title: string;
  subject: string;
  description: string;
}

export interface UpdateTicketPayload {
  ticket_id?: string;
  service_id: number;
  title: string;
  subject: string;
  description: string;
}

// Fetch all tickets (conversations) for a customer
export const useTickets = (page: number = 1) => {
  return useQuery({
    queryKey: [QueryKeys.CHAT_CONVERSATIONS, page],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/tickets?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      return response.json();
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("auth_token"),
  });
};

// Fetch ticket details with messages
export const useTicketDetail = (ticketId: string | null) => {
  return useQuery({
    queryKey: [QueryKeys.CHAT_MESSAGES, ticketId],
    queryFn: async (): Promise<{ data: TicketDetail }> => {
      if (!ticketId) {
        throw new Error("No ticket ID provided");
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/ticket/${ticketId}/show`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticket details");
      }

      return response.json();
    },
    enabled:
      typeof window !== "undefined" &&
      !!localStorage.getItem("auth_token") &&
      !!ticketId,
  });
};

// Create a new ticket (start conversation)
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketPayload) => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("service_id", payload.service_id.toString());
      formData.append("title", payload.title);
      formData.append("subject", payload.subject);
      formData.append("description", payload.description);

      console.log("Creating ticket with payload:", {
        service_id: payload.service_id,
        title: payload.title,
        subject: payload.subject,
        description: payload.description,
      });

      const response = await fetch(`${API_BASE_URL}/ticket/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Ticket creation response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("Ticket creation error:", error);
        throw error;
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate tickets list to refetch with the new ticket
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CHAT_CONVERSATIONS],
      });

      // If we have a ticket_id, also prefetch the detail
      const ticketId = data?.data?.ticket_id || data?.ticket_id;
      if (ticketId) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.CHAT_MESSAGES, ticketId],
        });
      }

      return data;
    },
  });
};

// Update ticket (send message)
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTicketPayload) => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      if (payload.ticket_id) {
        formData.append("ticket_id", payload.ticket_id);
      }
      formData.append("service_id", payload.service_id.toString());
      formData.append("title", payload.title);
      formData.append("subject", payload.subject);
      formData.append("description", payload.description);

      console.log("Updating ticket with payload:", {
        ticket_id: payload.ticket_id,
        service_id: payload.service_id,
        title: payload.title,
        subject: payload.subject,
        description: payload.description,
      });

      const response = await fetch(`${API_BASE_URL}/ticket/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate tickets list and specific ticket messages
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CHAT_CONVERSATIONS],
      });
      if (variables.ticket_id) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.CHAT_MESSAGES, variables.ticket_id],
        });
      }
    },
  });
};
