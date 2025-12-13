"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WithdrawalRequestData {
  amount: number;
}

interface WithdrawalRequestResponse {
  status: string;
  message: string;
  data?: any;
}

const requestWithdrawal = async (data: WithdrawalRequestData): Promise<WithdrawalRequestResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/withdrawal/request`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to request withdrawal");
  }

  return response.json();
};

export const useWithdrawalRequest = () => {
  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: (data) => {
      toast.success(data.message || "Withdrawal request submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit withdrawal request");
    },
  });
};