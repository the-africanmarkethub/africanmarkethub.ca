import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

export async function updateShopLogo(id: string, logoFile: File) {
  try {
    const formData = new FormData();
    formData.append("shop_id", id);
    formData.append("logo", logoFile);
    
    const url = `/vendor/shop/logo/update/${id}`;
    const response = await APICall(url, "POST", formData, true, null, true);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useUpdateShopLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, logoFile }: { id: string; logoFile: File }) => 
      updateShopLogo(id, logoFile),
    onSuccess: () => {
      toast.success("Shop logo updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.shopDetails] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update shop logo");
    },
  });
}