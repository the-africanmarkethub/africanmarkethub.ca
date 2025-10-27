import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import { toast } from "sonner";

// API function to delete a product
export async function deleteProductApi(productId: number) {
  try {
    const response = await APICall(
      `/vendor/product/delete/${productId}`,
      "DELETE"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Hook to handle product deletion
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      // Invalidate and refetch products query to update the list
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.products] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}
