"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartResponse, AddToCartPayload, AddToCartResponse } from "@/types/cart";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch cart items
const fetchCartItems = async (): Promise<CartResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/cart`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Add item to cart
const addToCart = async (payload: AddToCartPayload): Promise<AddToCartResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/cart/create`, {
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

// Delete cart item
const deleteCartItem = async (itemId: number): Promise<{ status: string; message: string }> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/cart/delete/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Hook to get cart items
export const useCartItems = () => {
  return useQuery({
    queryKey: QueryKeys.CART_ITEMS,
    queryFn: fetchCartItems,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate and refetch cart items
      queryClient.invalidateQueries({ queryKey: QueryKeys.CART_ITEMS });
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });
};

// Hook to delete cart item
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      // Invalidate and refetch cart items
      queryClient.invalidateQueries({ queryKey: QueryKeys.CART_ITEMS });
    },
    onError: (error) => {
      console.error('Failed to delete cart item:', error);
    },
  });
};