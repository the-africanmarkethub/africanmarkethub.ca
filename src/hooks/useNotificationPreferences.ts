"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface NotificationPreferences {
  id: number;
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  events: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  customer_id: number;
  created_at: string;
  updated_at: string;
}

interface NotificationPreferencesResponse {
  message: string;
  status: string;
  data: NotificationPreferences;
}

interface UpdateNotificationPreferencesData {
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  events: boolean;
}

const fetchNotificationPreferences = async (): Promise<NotificationPreferencesResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/communication-preferences`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notification preferences");
  }

  return response.json();
};

const updateNotificationPreferences = async (data: UpdateNotificationPreferencesData): Promise<NotificationPreferencesResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/communication/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update notification preferences");
  }

  return response.json();
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: fetchNotificationPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (data) => {
      toast.success(data.message || "Notification preferences updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update notification preferences");
    },
  });
};