"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiVariation {
  price: number | string;
  quantity: number | string;
  size_id: number | string;
  color_id: number | string;
}

interface ProductFormData {
  title: string;
  description: string;
  features: string;
  category_id: string;
  images: File[];
  // For products without variations
  sales_price?: string;
  regular_price?: string;
  quantity?: string;
  // For products with variations
  variations?: ApiVariation[];
  // Service-specific fields
  pricing_model?: string;
  delivery_method?: string;
  estimated_delivery_time?: string;
  available_days?: string[];
  available_from?: string;
  available_to?: string;
  // Dimension fields
  weight?: string;
  height?: string;
  length?: string;
  width?: string;
  size_unit?: "cm" | "m" | "ft" | "in";
  weight_unit?: "kg" | "g" | "lb" | "oz";
  // Other fields
  notify_user: boolean;
}

const createProduct = async (data: ProductFormData): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  
  // Add basic fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("features", data.features);
  formData.append("category_id", data.category_id);
  formData.append("notify_user", data.notify_user ? "1" : "0");
  
  // Add images
  data.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  // Add price and quantity (for non-variation products)
  if (data.sales_price) formData.append("sales_price", data.sales_price);
  if (data.regular_price) formData.append("regular_price", data.regular_price);
  if (data.quantity) formData.append("quantity", data.quantity);
  
  // Add variations if present
  if (data.variations && data.variations.length > 0) {
    data.variations.forEach((variation, index) => {
      formData.append(`variations[${index}][color_id]`, variation.color_id.toString());
      formData.append(`variations[${index}][size_id]`, variation.size_id.toString());
      formData.append(`variations[${index}][price]`, variation.price.toString());
      formData.append(`variations[${index}][quantity]`, variation.quantity.toString());
    });
  }
  
  // Add service-specific fields
  if (data.pricing_model) formData.append("pricing_model", data.pricing_model);
  if (data.delivery_method) formData.append("delivery_method", data.delivery_method);
  if (data.estimated_delivery_time) formData.append("estimated_delivery_time", data.estimated_delivery_time);
  if (data.available_days) {
    data.available_days.forEach((day, index) => {
      formData.append(`available_days[${index}]`, day);
    });
  }
  if (data.available_from) formData.append("available_from", data.available_from);
  if (data.available_to) formData.append("available_to", data.available_to);
  
  // Add dimension fields
  if (data.weight) formData.append("weight", data.weight);
  if (data.height) formData.append("height", data.height);
  if (data.length) formData.append("length", data.length);
  if (data.width) formData.append("width", data.width);
  if (data.size_unit) formData.append("size_unit", data.size_unit);
  if (data.weight_unit) formData.append("weight_unit", data.weight_unit);

  const response = await fetch(`${API_BASE_URL}/vendor/items/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create product");
  }

  return response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success("Product created successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["vendorProducts"] });
      queryClient.invalidateQueries({ queryKey: ["vendorItems"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
};

export type { ProductFormData, ApiVariation };