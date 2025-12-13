"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SettlementAccount {
  id: number;
  user_id: number;
  name: string;
  code: string;
  institution_number: string;
  transit_number: string;
  account_number: string;
  account_name: string;
}

interface SettlementAccountResponse {
  status: string;
  data: SettlementAccount;
}

interface CreateSettlementAccountData {
  name: string;
  code: string;
  institution_number: string;
  transit_number: string;
  account_number: string;
  account_name: string;
}

const fetchSettlementAccount = async (): Promise<SettlementAccountResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/settlement-account`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settlement account");
  }

  return response.json();
};

const createSettlementAccount = async (data: CreateSettlementAccountData): Promise<SettlementAccountResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/settlement-account/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create settlement account");
  }

  return response.json();
};

export const useSettlementAccount = () => {
  return useQuery({
    queryKey: ["settlement-account"],
    queryFn: fetchSettlementAccount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSettlementAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSettlementAccount,
    onSuccess: (data) => {
      toast.success("Bank account added successfully!");
      queryClient.invalidateQueries({ queryKey: ["settlement-account"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add bank account");
    },
  });
};