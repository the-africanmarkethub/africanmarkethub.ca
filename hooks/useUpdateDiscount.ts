"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateDiscountData {
  product_id?: number | string;
  start_time?: string;
  end_time?: string;
  discount_rate?: number | string;
  notify_users?: boolean;
  status?: "active" | "deactivate";
  discount_type?: "percentage" | "fixed";
  discount_code?: string;
}

const updateDiscount = async (id: number, data: UpdateDiscountData): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Format the data
  const formattedData = {
    ...data,
    notify_users: data.notify_users !== undefined ? (data.notify_users ? "true" : "false") : undefined,
  };

  // Remove undefined values
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key as keyof typeof formattedData] === undefined) {
      delete formattedData[key as keyof typeof formattedData];
    }
  });

  const response = await fetch(`${API_BASE_URL}/vendor/discount/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update discount");
  }

  return response.json();
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDiscountData }) => updateDiscount(id, data),
    onSuccess: (data) => {
      toast.success("Discount updated successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["vendorDiscounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update discount");
    },
  });
};