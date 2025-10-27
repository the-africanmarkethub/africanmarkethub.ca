import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import { toast } from "sonner";

export interface CommunicationPreferences {
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  events: boolean;
}

// Get current communication preferences
export async function getCommunicationPreferences() {
  try {
    const response = await APICall("/communication-preferences", "GET", null, true);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Update communication preferences
export async function updateCommunicationPreferences(preferences: CommunicationPreferences) {
  try {
    const formData = new FormData();
    
    // Append all preferences as form-data
    Object.entries(preferences).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const response = await APICall(
      "/communication/create",
      "POST",
      formData,
      true,
      null,
      true
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// Hook to get communication preferences
export function useGetCommunicationPreferences() {
  return useQuery({
    queryKey: [QUERY_KEY.communication],
    queryFn: getCommunicationPreferences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to update communication preferences
export function useUpdateCommunicationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: CommunicationPreferences) => 
      updateCommunicationPreferences(preferences),
    onSuccess: () => {
      toast.success("Notification preferences updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.communication] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update notification preferences");
    },
  });
}