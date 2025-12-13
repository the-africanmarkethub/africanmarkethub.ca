"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ShippingRatePayload, ShippingRateResponse } from "@/types/shipping";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get shipping rates
const getShippingRates = async (payload: ShippingRatePayload): Promise<ShippingRateResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/shipping/rates`, {
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

// Hook to get shipping rates
export const useShippingRates = (payload: ShippingRatePayload | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: payload ? QueryKeys.SHIPPING_RATES(0, payload.products) : ['shipping', 'rates'],
    queryFn: () => payload ? getShippingRates(payload) : Promise.reject('No payload'),
    enabled: enabled && !!payload,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to manually calculate shipping rates
export const useCalculateShipping = () => {
  return useMutation({
    mutationFn: getShippingRates,
    onError: (error) => {
      console.error('Failed to calculate shipping:', error);
    },
  });
};