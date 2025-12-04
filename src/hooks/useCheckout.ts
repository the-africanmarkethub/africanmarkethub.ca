"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutPayload, CheckoutResponse } from "@/types/checkout";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Process checkout
const processCheckout = async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Hook to process checkout
export const useCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: processCheckout,
    onSuccess: () => {
      // Clear cart after successful checkout
      queryClient.invalidateQueries({ queryKey: QueryKeys.CART_ITEMS });
    },
    onError: (error) => {
      console.error('Checkout failed:', error);
    },
  });
};