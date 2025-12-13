"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WishlistItem {
  id: number;
  customer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    sales_price: string;
    regular_price: string;
    quantity: number;
    images: string[];
    status: string;
    type: string;
    category_id: number;
    views: number;
    sku: string;
    average_rating: number;
    variations: any[];
  };
}

interface WishlistResponse {
  status: string;
  message: string;
  data: WishlistItem[];
}

interface AddWishlistPayload {
  product_id: number;
  quantity: number;
}

// Get all wishlist items
const fetchWishlist = async (): Promise<WishlistResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/customer/wishlists`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
};

// Add item to wishlist
const addToWishlist = async (payload: AddWishlistPayload): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  console.log("Adding to wishlist payload:", payload);

  const response = await fetch(`${API_BASE_URL}/customer/wishlist/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("Wishlist response status:", response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.log("Wishlist error:", errorData);
    throw errorData;
  }

  return response.json();
};

// Delete item from wishlist
const deleteFromWishlist = async (wishlistId: number): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/customer/wishlist/delete/${wishlistId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wishlist_id: wishlistId
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Hooks
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      // Refetch wishlist after adding
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      console.error("Add to wishlist failed:", error);
      
      if (error?.message?.includes("not authorized") || error?.message?.includes("Login as a customer")) {
        toast.error("Please login to add items to your wishlist");
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add item to wishlist");
      }
    },
  });
};

export const useDeleteFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFromWishlist,
    onMutate: async (wishlistId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically update to remove the item
      queryClient.setQueryData(["wishlist"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((item: any) => item.id !== wishlistId)
        };
      });

      // Return a context object with the snapshotted value
      return { previousWishlist };
    },
    onError: (err: any, wishlistId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      console.error("Delete from wishlist failed:", err);
      
      if (err?.message?.includes("not authorized") || err?.message?.includes("Login as a customer")) {
        toast.error("Please login to manage your wishlist");
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to remove item from wishlist");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

// Helper hook to check if product is in wishlist
export const useIsInWishlist = (productId: number) => {
  const { data: wishlistResponse } = useWishlist();
  
  const isInWishlist = wishlistResponse?.data?.some(item => item.product_id === productId) || false;
  const wishlistItem = wishlistResponse?.data?.find(item => item.product_id === productId);
  
  return { isInWishlist, wishlistItem };
};