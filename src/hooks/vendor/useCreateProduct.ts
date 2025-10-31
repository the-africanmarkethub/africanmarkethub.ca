import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

// Standalone API call function
export async function createProductApi(data: any) {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const response = await APICall(
    "/vendor/items/create",
    "POST",
    data,
    isFormData
  );
  return response.data;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      // Invalidate products queries to refetch the list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.products] });
    },
  });
}
