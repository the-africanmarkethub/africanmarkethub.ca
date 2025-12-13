"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  type: "customer" | "vendor";
  status: string;
  created_at: string;
  updated_at: string;
}

interface FAQResponse {
  total: number;
  offset: number;
  limit: number;
  data: FAQItem[];
}

const fetchFAQs = async (type: "customer" | "vendor"): Promise<FAQResponse> => {
  const response = await fetch(`${API_BASE_URL}/faqs?type=${type}`);

  if (!response.ok) {
    throw new Error("Failed to fetch FAQs");
  }

  return response.json();
};

export const useFAQs = (type: "customer" | "vendor" = "customer") => {
  return useQuery({
    queryKey: ["faqs", type],
    queryFn: () => fetchFAQs(type),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCustomerFAQs = () => {
  return useFAQs("customer");
};

export const useVendorFAQs = () => {
  return useFAQs("vendor");
};