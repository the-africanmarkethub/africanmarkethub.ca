import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormData {
  [key: string]: unknown;
}

export async function initiateWithdraw(formData: FormData) {
  try {
    const url = "/vendor/withdrawal/request";
    const response = await APICall(url, "POST", formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useInitiateWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => initiateWithdraw(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.wallet] });
    },
    onError: (error) => {
      // Error handled by calling components
    },
  });
}
