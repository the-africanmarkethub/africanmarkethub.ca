import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "@/services/addressService";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: (data) => {
      toast.success(data.message || "Address deleted successfully!");
      // Invalidate addresses query to refresh the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.address] });
    },
    onError: (error: ErrorResponse) => {
      console.error("Failed to delete address:", error);

      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Failed to delete address. Please try again.";

      if (status === 404) {
        errorMessage = "Address not found.";
      } else if (status === 401) {
        errorMessage = "Please login to delete address.";
      } else if (status === 403) {
        errorMessage = "You don't have permission to delete this address.";
      } else if (status === 400) {
        errorMessage = responseData?.message || "Cannot delete default address.";
      } else if (status && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}