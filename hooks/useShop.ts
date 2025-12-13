"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateShopPayload {
  name: string;
  address: string;
  type: "products" | "services";
  logo: File;
  banner: File;
  description: string;
  subscription_id: string;
  state_id: string;
  city_id: string;
  country_id: string;
  category_id: string;
  billing_cycle: "monthly" | "yearly";
}

const createShop = async (payload: CreateShopPayload): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Create FormData for file uploads
  const formData = new FormData();
  
  // Add all fields to FormData
  formData.append("name", payload.name);
  formData.append("address", payload.address);
  formData.append("type", payload.type);
  formData.append("logo", payload.logo);
  formData.append("banner", payload.banner);
  formData.append("description", payload.description);
  formData.append("subscription_id", payload.subscription_id);
  formData.append("state_id", payload.state_id);
  formData.append("city_id", payload.city_id);
  formData.append("country_id", payload.country_id);
  formData.append("category_id", payload.category_id);
  formData.append("billing_cycle", payload.billing_cycle);

  const response = await fetch(`${API_BASE_URL}/shop/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      // Don't set Content-Type for FormData, browser will set it with boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShop,
    onSuccess: (data) => {
      console.log("Shop created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Shop creation failed:", error);
    },
  });
};