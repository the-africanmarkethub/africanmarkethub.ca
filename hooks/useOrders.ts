"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface OrderItem {
  id: number;
  product_id: number;
  vendor_id: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    regular_price: string;
    sales_price: string;
    images: string[];
    stock_quantity: number;
    category: string;
  };
}

interface Order {
  id: number;
  customer_id: number;
  vendor_id: number[];
  total: string;
  payment_method: string;
  shipping_status: string;
  shipping_method: string | null;
  shipping_fee: string;
  tax: string;
  discount: string;
  status: string;
  order_date: string;
  delivery_date: string | null;
  tracking_number: string | null;
  payment_status: string;
  notes: string | null;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  vendor?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    business_name: string;
  };
  customer?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
  };
  address?: {
    id: number;
    customer_id: number;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    address_label: string;
    phone: string;
  };
}

interface OrdersResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Order[];
    total_orders: number;
    total_amount_spent: string;
    total_cancelled: number;
    total_delivered: number;
  };
}

const fetchOrders = async (page: number = 1): Promise<OrdersResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/orders?page=${page}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
};

export const useOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => fetchOrders(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrderById = (orderId: number) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const result = await response.json();
      return result;
    },
    enabled: !!orderId,
  });
};