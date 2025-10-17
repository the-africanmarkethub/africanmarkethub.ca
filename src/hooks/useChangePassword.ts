import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/authService";
import { toast } from "sonner";

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      console.log("Sending password change request:", data);
      const response = await changePassword(data);
      console.log("Password change response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("Password changed successfully:", data);
      toast.success("Password changed successfully");
    },
    onError: (error: unknown) => {
      console.error("Password change error:", error);
      
      const err = error as any;
      let errorMessage = "Failed to change password";
      
      // Handle validation errors from the API
      if (err?.response?.data) {
        const data = err.response.data;
        
        // Check for validation errors in various formats
        if (data.new_password && Array.isArray(data.new_password)) {
          errorMessage = data.new_password[0];
        } else if (data.current_password && Array.isArray(data.current_password)) {
          errorMessage = data.current_password[0];
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}