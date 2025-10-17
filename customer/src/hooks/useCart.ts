import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/services/cartService";
import { AddToCartPayload } from "@/types/cart.types";
import { QUERY_KEY } from "@/constants/queryKeys";
import { getAuthToken } from "@/utils/header";

export const useGetCart = () => {
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  return useQuery({
    queryKey: [QUERY_KEY.cart],
    queryFn: getCart,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quantity, productId, sizeId, colorId }: { 
      quantity: number; 
      productId: number;
      sizeId?: number;
      colorId?: number;
    }) =>
      updateCartItem({ quantity, productId, sizeId, colorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => deleteCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
    },
  });
};
