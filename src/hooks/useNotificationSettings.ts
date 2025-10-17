import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { toast } from "sonner";

export interface NotificationSettings {
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  events: boolean;
}

interface NotificationSettingsResponse {
  id: number;
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  events: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

async function fetchNotificationSettings(): Promise<NotificationSettingsResponse> {
  const response = await APICall("/communication-preferences", "GET");
  return response.data;
}

async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<any> {
  // Transform boolean values to strings as the API expects
  const apiPayload = {
    marketing_emails: settings.marketing_emails ? "true" : "false",
    new_products: settings.new_products ? "true" : "false",
    promotions: settings.promotions ? "true" : "false",
    push_notification: settings.push_notification ? "true" : "false",
    email_notification: settings.email_notification ? "true" : "false",
    sms_notification: settings.sms_notification ? "true" : "false",
    events: settings.events ? "true" : "false",
  };

  const response = await APICall("/communication/create", "POST", apiPayload);
  return response;
}

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationSettingsResponse>({
    queryKey: ["notificationSettings"],
    queryFn: fetchNotificationSettings,
  });

  const mutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.success("Notification settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update notification settings"
      );
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
