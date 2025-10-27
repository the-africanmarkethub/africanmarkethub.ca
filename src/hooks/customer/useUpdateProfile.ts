import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/authService";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import { toast } from "sonner";

interface UpdateProfileData {
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export function useUpdateProfile(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.profile] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
}