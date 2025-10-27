import { useMutation } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";

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
  return useMutation({
    mutationFn: createProductApi,
  });
}
