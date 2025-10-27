import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

export async function updateShopBanner(id: string, bannerFile: File) {
  try {
    const formData = new FormData();
    formData.append("shop_id", id);
    formData.append("banner", bannerFile);
    
    const url = "/vendor/shop/banner/update";
    const response = await APICall(url, "POST", formData, true, null, true);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useUpdateShopBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bannerFile }: { id: string; bannerFile: File }) => 
      updateShopBanner(id, bannerFile),
    onSuccess: () => {
      toast.success("Shop banner updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.shopDetails] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update shop banner");
    },
  });
}