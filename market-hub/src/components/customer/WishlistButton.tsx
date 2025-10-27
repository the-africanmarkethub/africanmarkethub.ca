import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  useAddToWishlist,
  useWishlist,
  useRemoveFromWishlist,
} from "@/hooks/customer/useWishlist";
import { getAuthToken } from "@/utils/header";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: number;
  quantity?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled" | "floating";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function WishlistButton({
  productId,
  quantity = 1,
  className = "",
  size = "md",
  variant = "floating",
  position = "top-right",
}: WishlistButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  useEffect(() => {
    setIsMounted(true);
    const token = getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  // Check if product is in wishlist
  const isInWishlist =
    isAuthenticated &&
    wishlistData?.data?.some((item) => item.product_id === productId);

  // Get wishlist item ID if product is in wishlist
  const wishlistItem =
    isAuthenticated &&
    wishlistData?.data?.find((item) => item.product_id === productId);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please log in to add items to your wishlist.");
      return;
    }

    if (isInWishlist && wishlistItem) {
      removeFromWishlist.mutate(wishlistItem.id);
    } else {
      addToWishlist.mutate({
        product_id: productId,
        quantity,
      });
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    outline: "border border-gray-300 hover:border-red-300 hover:bg-red-50",
    filled: "bg-red-500 text-white hover:bg-red-600",
    floating: "bg-white shadow-md hover:shadow-lg",
  };

  const positionClasses = {
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${positionClasses[position]}
    ${className}
    rounded-full flex items-center justify-center transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variant === "floating" ? "absolute z-10" : ""}
  `;

  const heartClasses = `
    ${iconSizes[size]}
    ${
      addToWishlist.isPending || removeFromWishlist.isPending
        ? "animate-pulse"
        : "w-[10.45px] h-[10.45px] md:w-[16px] md:h-[16px]"
    }
  `;

  // Prevent hydration issues by only rendering interactive state after mount
  if (!isMounted) {
    return (
      <button
        disabled
        className={baseClasses}
        title="Loading..."
      >
        <Heart
          className={heartClasses}
          fill="none"
          color="#464646"
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={
        !isAuthenticated ||
        addToWishlist.isPending ||
        removeFromWishlist.isPending
      }
      className={baseClasses}
      title={
        !isAuthenticated
          ? "Login to add to wishlist"
          : isInWishlist
            ? "Remove from wishlist"
            : "Add to wishlist"
      }
    >
      <Heart
        className={heartClasses}
        fill={isInWishlist ? "currentColor" : "none"}
        color={isInWishlist ? "#ef4444" : "#464646"}
      />
    </button>
  );
}
