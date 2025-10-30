import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

export interface UpdateShopPayload {
  name: string;
  type: string;
  description: string;
  address: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  category_id?: string;
  subscription_id?: string;
  billing_cycle?: string;
}

export async function updateShop(slug: string, payload: UpdateShopPayload) {
  try {
    const url = `/vendor/shop/update/${slug}`;
    const response = await APICall(url, "PUT", payload, false, null, false);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: UpdateShopPayload }) => 
      updateShop(slug, payload),
    onSuccess: (data) => {
      toast.success("Shop details updated successfully!");
      // Invalidate shop-related queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.shop] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.shopDetails] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update shop details");
      throw error;
    },
  });
}