import { useMutation, useQuery } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";

interface ProductFormData {
  title: string;
  description: string;
  features: string;
  category: string;
  images: File[];
  price: string;
  quantity: string;
  shipping_option: string;
  date_added: Date;
  expiry_date?: Date;
  discount_type?: "percentage" | "fixed";
  discount_value?: string;
  status: "draft" | "published";
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file: File, index: number) => {
            formData.append(`images[${index}]`, file);
          });
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await APICall(
        "/products",
        "POST",
        formData,
        true,
        null,
        true
      );

      return response.data;
    },
  });
}

export function useGetProducts() {
  return useQuery({
    queryKey: [QUERY_KEY.products],
    queryFn: async () => {
      const response = await APICall("/products", "GET", null, true);
      return response.data;
    },
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY.products, id],
    queryFn: async () => {
      const response = await APICall(`/products/${id}`, "GET", null, true);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateProduct(id: string) {
  return useMutation({
    mutationFn: async (data: Partial<ProductFormData>) => {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file: File, index: number) => {
            formData.append(`images[${index}]`, file);
          });
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await APICall(
        `/products/${id}`,
        "PUT",
        formData,
        true,
        null,
        true
      );

      return response.data;
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await APICall(
        `/products/${id}`,
        "DELETE",
        null,
        true,
        null,
        true
      );
      return response.data;
    },
  });
}
