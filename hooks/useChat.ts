"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ChatConversation {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  is_online?: boolean;
  service_id?: string;
  service_name?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'customer' | 'vendor';
  sender_name: string;
  sender_avatar?: string;
  message: string;
  timestamp: string;
  is_read?: boolean;
  attachments?: string[];
}

export interface SendMessagePayload {
  conversation_id?: string;
  vendor_id: string;
  service_id?: string;
  message: string;
  attachments?: string[];
}

// Fetch all conversations for a customer
export const useConversations = () => {
  return useQuery({
    queryKey: [QueryKeys.CHAT_CONVERSATIONS],
    queryFn: async (): Promise<{ data: ChatConversation[] }> => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      return response.json();
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem("auth_token"),
  });
};

// Fetch messages for a specific conversation
export const useMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: [QueryKeys.CHAT_MESSAGES, conversationId],
    queryFn: async (): Promise<{ data: ChatMessage[] }> => {
      if (!conversationId) {
        return { data: [] };
      }

      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      return response.json();
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem("auth_token") && !!conversationId,
  });
};

// Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate conversations and messages
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT_CONVERSATIONS] });
      if (variables.conversation_id) {
        queryClient.invalidateQueries({ 
          queryKey: [QueryKeys.CHAT_MESSAGES, variables.conversation_id] 
        });
      }
    },
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/conversations/${conversationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }

      return response.json();
    },
    onSuccess: (_, conversationId) => {
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT_CONVERSATIONS] });
      queryClient.invalidateQueries({ 
        queryKey: [QueryKeys.CHAT_MESSAGES, conversationId] 
      });
    },
  });
};

// Start a new conversation with a vendor
export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, serviceId }: { vendorId: string; serviceId?: string }) => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/chat/conversations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          service_id: serviceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate conversations to show the new one
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT_CONVERSATIONS] });
    },
  });
};