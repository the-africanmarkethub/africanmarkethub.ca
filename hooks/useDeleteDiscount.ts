"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const deleteDiscount = async (id: number): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/discount/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete discount");
  }

  return response.json();
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDiscount,
    onSuccess: (data) => {
      toast.success("Discount deleted successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["vendorDiscounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete discount");
    },
  });
};