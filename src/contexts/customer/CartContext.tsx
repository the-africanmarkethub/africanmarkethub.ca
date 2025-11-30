"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getAuthToken } from "@/utils/header";
import {
  useAddToCart,
  useDeleteCartItem,
  useGetCart,
  useUpdateCartItem,
} from "@/hooks/customer/useCart";
import {
  AddToCartPayloadItem,
  Cart,
  CartItem,
  LocalCartItem,
} from "@/types/customer/cart.types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";
import { usePathname } from "next/navigation";

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  addToCart: (item: AddToCartPayloadItem) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  deleteCartItem: (itemId: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // Check if we're on vendor side - don't load cart for vendors
  const isVendorSide = pathname?.startsWith("/vendor") || false;

  // Get remote cart for logged-in users (but not for vendor pages)
  const { data: remoteCart, isLoading: isRemoteCartLoading } = useGetCart({
    enabled: !isVendorSide, // Disable cart API calls on vendor side
  });

  // Mutations for remote cart
  const addToCartMutation = useAddToCart();
  const updateCartMutation = useUpdateCartItem();
  const deleteCartMutation = useDeleteCartItem();

  // No need to fetch products anymore - they're stored in localCart

  // Load token and local cart from localStorage on initial render
  useEffect(() => {
    const storedToken = getAuthToken();
    setToken(storedToken);

    // Skip cart operations on vendor side
    if (isVendorSide) {
      setIsSyncing(false);
      return;
    }

    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure parsedCart is an array
        if (Array.isArray(parsedCart)) {
          setLocalCart(parsedCart);
        } else {
          console.error("Cart in localStorage is not an array, resetting cart");
          setLocalCart([]);
          localStorage.removeItem("cart");
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setLocalCart([]);
      localStorage.removeItem("cart");
    }
    setIsSyncing(false);
  }, [isVendorSide]);

  // Sync local cart to remote when user logs in
  useEffect(() => {
    // Skip cart sync on vendor side
    if (isVendorSide) {
      return;
    }

    const syncCart = async () => {
      if (token && localCart.length > 0) {
        setIsSyncing(true);
        toast.info("Syncing your cart...");

        try {
          // Extract only the essential fields for API sync
          const cartItemsForSync: AddToCartPayloadItem[] = localCart.map(
            (item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              color_id: item.color_id,
              size_id: item.size_id,
            })
          );

          await addToCartMutation.mutateAsync(
            { cart_items: cartItemsForSync },
            {
              onSuccess: () => {
                toast.success("Cart synced successfully!");
                setLocalCart([]);
                localStorage.removeItem("cart");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
              },
              onError: (error) => {
                console.error("Cart sync failed:", error);
                toast.error(
                  "Failed to sync cart. Your items are saved locally."
                );
              },
              onSettled: () => {
                setIsSyncing(false);
              },
            }
          );
        } catch (error) {
          console.error("Cart sync error:", error);
          toast.error(
            "Failed to sync cart. Your items remain in local storage."
          );
          setIsSyncing(false);
        }
      } else {
        setIsSyncing(false);
      }
    };
    syncCart();
  }, [token, localCart.length, isVendorSide]);

  const cartItems: CartItem[] = useMemo(() => {
    if (token) {
      // The API returns the array of items directly in the `data` property.
      return remoteCart?.data || [];
    }

    // For guest users, use the stored product data from localStorage
    const safeLocalCart = Array.isArray(localCart) ? localCart : [];
    return safeLocalCart.map((item, index) => ({
      id: index, // Temporary ID for local item
      product_id: item.product_id,
      quantity: item.quantity,
      color_id: item.color_id,
      size_id: item.size_id,
      product: item.product, // Product data is already stored
      // These properties might not be available for guest cart
      created_at: item.added_at,
      updated_at: item.added_at,
    })) as CartItem[];
  }, [token, remoteCart, localCart]);

  const addToCart = useCallback(
    async (item: AddToCartPayloadItem) => {
      console.log("🛒 Adding to cart:", { item, hasToken: !!token });

      if (token) {
        console.log("📡 Calling API with authenticated user");
        addToCartMutation.mutate(
          { cart_items: [item] },
          {
            onSuccess: (data) => {
              console.log("✅ Cart API success:", data);
              toast.success("Item added to cart!");
            },
            onError: (error) => {
              console.error("❌ Failed to add item to remote cart:", error);
              toast.error("Failed to add item to cart. Please try again.");
            },
          }
        );
      } else {
        // For guest users, use provided product data or fetch if not available
        try {
          let productData = item.product;

          if (!productData) {
            // Fallback: try to fetch product data (might fail if endpoint expects slug)
            const response = await APICall(
              `/products/${item.product_id}`,
              "GET"
            );
            productData = response.data.product;
          }

          // Ensure we have product data before proceeding
          if (!productData) {
            throw new Error("Unable to get product information");
          }

          const localCartItem: LocalCartItem = {
            product_id: item.product_id,
            quantity: item.quantity,
            color_id: item.color_id,
            size_id: item.size_id,
            product: productData,
            added_at: new Date().toISOString(),
          };

          const updatedCart = [...localCart, localCartItem];
          setLocalCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));

          // Manually invalidate to trigger a re-render with the new local data
          queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
          toast.success("Item added to cart!");
        } catch (error) {
          console.error("Failed to add item to cart:", error);
          toast.error("Failed to add item to cart. Please try again.");
        }
      }
    },
    [token, localCart]
  );

  const updateCartItemQuantity = useCallback(
    (itemId: number, quantity: number) => {
      if (token) {
        // Find the cart item to get its product details
        const cartItem = cartItems.find((item) => item.id === itemId);
        if (cartItem) {
          updateCartMutation.mutate({
            quantity,
            productId: cartItem.product_id,
            sizeId: cartItem.size_id || undefined,
            colorId: cartItem.color_id || undefined,
          });
        }
      } else {
        // Handle local cart update
        const updatedCart = localCart.map((item, index) => {
          if (index === itemId) {
            return { ...item, quantity };
          }
          return item;
        });
        setLocalCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
      }
    },
    [token, cartItems, localCart]
  );

  const deleteCartItem = useCallback(
    (itemId: number) => {
      if (token) {
        deleteCartMutation.mutate(itemId);
      } else {
        // Handle local cart delete for guests
        const updatedCart = localCart.filter((_, index) => index !== itemId);
        setLocalCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cart] });
        toast.success("Item removed from cart");
      }
    },
    [token, localCart]
  );

  const clearCart = useCallback(() => {
    if (token) {
      // remote clear all
      cartItems.forEach((item: CartItem) => deleteCartMutation.mutate(item.id));
    } else {
      setLocalCart([]);
      localStorage.removeItem("cart");
    }
  }, [token, cartItems]);

  const value = {
    cart: token ? remoteCart?.data || null : null,
    cartItems,
    addToCart,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart,
    isLoading: isRemoteCartLoading,
    isSyncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
