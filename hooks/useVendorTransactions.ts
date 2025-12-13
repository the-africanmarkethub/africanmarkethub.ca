"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Transaction {
  id: number;
  order_id: string;
  customer_name: string;
  product: string;
  amount: number;
  quantity: number;
  date: string;
  payment_status: string;
  status: string;
}

interface VendorTransactionsResponse {
  status: string;
  data: {
    data: Transaction[];
    total: number;
    current_page: number;
    per_page: number;
  };
}

const fetchVendorTransactions = async (page: number = 1, perPage: number = 12): Promise<VendorTransactionsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/transactions?page=${page}&per_page=${perPage}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor transactions");
  }

  return response.json();
};

export const useVendorTransactions = (page: number = 1, perPage: number = 12) => {
  return useQuery({
    queryKey: ["vendor-transactions", page, perPage],
    queryFn: () => fetchVendorTransactions(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};