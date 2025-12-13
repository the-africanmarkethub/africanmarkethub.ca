"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CreateDiscountData {
  product_id: number | string;
  start_time: string;
  end_time: string;
  discount_rate: number | string;
  notify_users: boolean;
  status: "active" | "deactivate";
  discount_type: "percentage" | "fixed";
  discount_code: string;
}

const createDiscount = async (data: CreateDiscountData): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/discount/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      notify_users: data.notify_users ? "true" : "false",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create discount");
  }

  return response.json();
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDiscount,
    onSuccess: (data) => {
      toast.success("Discount created successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["vendorDiscounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create discount");
    },
  });
};