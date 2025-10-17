import { CreateShopPayload } from "@/types/auth.types";
import APICall from "@/utils/ApiCall";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export async function createShop(payload: CreateShopPayload) {
  try {
    const formData = new FormData();

    for (const key in payload) {
      const value = payload[key as keyof CreateShopPayload];

      // Skip undefined values
      if (value === undefined || value === null) continue;

      // Append files directly
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }

    const res = await APICall(
      "/shop/create",
      "POST",
      formData,
      true,
      null,
      true
    ); // silent: true to avoid duplicate toasts

    // Check response status
    return res.data; // Success: return response.data
  } catch (error) {
    // Handle error
    throw error; // Rethrow the error to be handled by the mutation
  }
}

export function useCreateShop() {
  const router = useRouter();

  return useMutation({
    mutationFn: createShop,
    onSuccess: (data) => {
      toast.success(`Welcome ${data?.name || "User"}!`);
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create shop");
    },
  });
}
