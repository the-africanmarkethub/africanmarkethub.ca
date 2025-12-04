"use client";

import { useIsInWishlist, useAddToWishlist, useDeleteFromWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function WishlistButton({ 
  productId, 
  className = "", 
  size = "md",
  showText = false 
}: WishlistButtonProps) {
  const { isInWishlist, wishlistItem } = useIsInWishlist(productId);
  const addToWishlist = useAddToWishlist();
  const deleteFromWishlist = useDeleteFromWishlist();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6",
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist && wishlistItem) {
        await deleteFromWishlist.mutateAsync(wishlistItem.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist.mutateAsync({
          product_id: productId,
          quantity: 1,
        });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const isLoading = addToWishlist.isPending || deleteFromWishlist.isPending;

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={`${
        showText ? "flex items-center space-x-2 px-4 py-2" : "p-2"
      } ${
        isInWishlist 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-600 hover:text-red-500"
      } transition-colors disabled:opacity-50 ${className}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <svg className={`animate-spin ${sizeClasses[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          className={sizeClasses[size]}
          fill={isInWishlist ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
      {showText && (
        <span className="font-medium">
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}