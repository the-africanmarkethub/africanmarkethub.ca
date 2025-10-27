import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

interface WithdrawRequest {
  amount: number;
}

export async function withdraw(data: WithdrawRequest) {
  try {
    const response = await APICall("/vendor/withdrawal/request", "POST", data);
    return response;
  } catch (error) {
    throw error;
  }
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      // Invalidate related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.withdrawals] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.wallet] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.wallet, "earnings"],
      });
    },
    onError: (error) => {
      console.error("Withdrawal failed:", error);
    },
  });
}
