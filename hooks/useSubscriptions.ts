"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Subscription {
  id: number;
  name: string;
  monthly_price: number;
  yearly_price: number;
  status: string;
  features: string;
  payment_link: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionsResponse {
  message: string;
  status: string;
  data: Subscription[];
}

const fetchSubscriptions = async (): Promise<SubscriptionsResponse> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return response.json();
};

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};