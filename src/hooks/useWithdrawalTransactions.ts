"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WithdrawalTransaction {
  id: number;
  date: string;
  amount: number;
  type: string;
  description: string;
  status: "Completed" | "Failed" | "Pending";
}

interface WithdrawalTransactionsResponse {
  status: string;
  data: {
    data: WithdrawalTransaction[];
    total: number;
    current_page: number;
    per_page: number;
  };
}

const fetchWithdrawalTransactions = async (page: number = 1, perPage: number = 12): Promise<WithdrawalTransactionsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/withdrawals?page=${page}&per_page=${perPage}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch withdrawal transactions");
  }

  return response.json();
};

export const useWithdrawalTransactions = (page: number = 1, perPage: number = 12) => {
  return useQuery({
    queryKey: ["withdrawal-transactions", page, perPage],
    queryFn: () => fetchWithdrawalTransactions(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};