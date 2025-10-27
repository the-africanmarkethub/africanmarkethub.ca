import { CreateShopPayload } from "@/types/vendor/auth.types";
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
    mutationFn: (payload: CreateShopPayload) => {
      console.log("useCreateShop mutation called with:", payload);
      return createShop(payload);
    },
    onSuccess: (data) => {
      console.log("Create shop success:", data);
      toast.success(`Shop created successfully! Please login to continue.`);
      router.push("/vendor/sign-in");
    },
    onError: (error: Error) => {
      console.log("Create shop error:", error);
      toast.error(error.message || "Failed to create shop");
    },
  });
}
