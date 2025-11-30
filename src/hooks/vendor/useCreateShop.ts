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
    mutationFn: (payload: CreateShopPayload) => createShop(payload),
    onSuccess: () => {
      // Clear customer authentication tokens since user is now a vendor
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      toast.success(`Shop created successfully! Please login to continue.`);
      router.push("/vendor/sign-in");
    },
    onError: (error: any) => {

      // Handle API error response format
      let errorMessage = "Failed to create shop";

      if (error?.response?.data) {
        const errorData = error.response.data;
        // Use error_detail if available, otherwise use message
        errorMessage =
          errorData.error_detail || errorData.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
}
