"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CartItem, useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { saveWishlist } from "@/lib/api/customer/wishlist";
import { AxiosError } from "axios";

export type WishlistItem = Omit<CartItem, "qty">;

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
  moveToCart: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { addToCart } = useCart();

  // Load wishlist on mount
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) setWishlist(JSON.parse(stored));
}, []);


  // Persist changes
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
}, [wishlist]);


  /**
   * ADD TO WISHLIST
   */
  const addToWishlist = async (item: WishlistItem) => {
    if (wishlist.find((p) => p.id === item.id)) {
      toast.success("Already in wishlist");
      return;
    }

    try {
      await saveWishlist({
        product_id: item.id,
        quantity: 1,
      });

      setWishlist((prev) => [...prev, item]);
      toast.success("Added to wishlist");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to save wishlist");
      console.error(error);
    }
  };

  /**
   * REMOVE FROM WISHLIST
   */
  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * CHECK IF PRODUCT EXISTS IN WISHLIST
   */
  const isWishlisted = (id: number) => {
    return wishlist.some((p) => p.id === id);
  };

  /**
   * CLEAR ALL
   */
  const clearWishlist = () => {
    setWishlist([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  /**
   * MOVE WISHLIST ITEM → CART
   */
  const moveToCart = (id: number) => {
    const item = wishlist.find((i) => i.id === id);
    if (!item) return;
    addToCart({ ...item, qty: 1 });
    removeFromWishlist(id);
    toast.success("Moved to cart");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
