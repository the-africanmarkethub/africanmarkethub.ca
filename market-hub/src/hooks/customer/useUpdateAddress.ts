import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress, CreateAddressPayload } from "@/services/addressService";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

interface UpdateAddressParams {
  id: number;
  data: Partial<CreateAddressPayload>;
}

interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateAddressParams) => updateAddress(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Address updated successfully!");
      // Invalidate addresses query to refresh the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.address] });
    },
    onError: (error: ErrorResponse) => {
      console.error("Failed to update address:", error);

      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Failed to update address. Please try again.";

      if (status === 404) {
        errorMessage = "Address not found.";
      } else if (status === 422) {
        if (responseData?.errors) {
          const firstError = Object.values(responseData.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : "Invalid address data.";
        } else {
          errorMessage = responseData?.message || "Invalid address data.";
        }
      } else if (status === 401) {
        errorMessage = "Please login to update address.";
      } else if (status === 403) {
        errorMessage = "You don't have permission to update this address.";
      } else if (status && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}