import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export async function deleteShop(id: string) {
  try {
    const url = `/vendor/shop/delete/${id}`;
    const response = await APICall(url, "DELETE");
    return response;
  } catch (error) {
    throw error;
  }
}

export function useDeleteShop() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteShop(id),
    onSuccess: () => {
      toast.success("Shop deleted successfully!");
      queryClient.clear();
      router.push("/create-shop");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete shop");
    },
  });
}