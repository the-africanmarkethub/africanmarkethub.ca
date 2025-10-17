"use client";

import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { NoResults } from "@/components/ui/no-results";
import Image from "next/image";
import Link from "next/link";

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export default function WishlistPage() {
  const { data: wishlistData, isLoading, error } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemoveItem = (wishlistItemId: number) => {
    removeFromWishlist.mutate(wishlistItemId);
  };

  const handleUpdateQuantity = (
    wishlistItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity > 0) {
      // TODO: Implement update wishlist item functionality
      console.log(
        `Update quantity for item ${wishlistItemId} to ${newQuantity}`
      );
    }
  };

  // Show empty wishlist prompt if user is not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <NoResults
          title="Your wishlist is empty"
          message="Sign in to save your favorite products and access them from any device."
          icon="💝"
          showGoBack={true}
          showBrowseAll={true}
          onBrowseAll={() => (window.location.href = "/sign-in")}
          browseAllText="Sign In"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoResults
          title="Error loading wishlist"
          message="Failed to load your wishlist. Please try again."
          icon="❌"
          showGoBack={true}
          showBrowseAll={true}
        />
      </div>
    );
  }

  if (!wishlistData?.data || wishlistData.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoResults
          title="Your wishlist is empty"
          message="Start adding products to your wishlist to see them here."
          icon="💝"
          showGoBack={true}
          showBrowseAll={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        My Wishlist ({wishlistData.total} items)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistData.data.map((item) => {
          const regularPrice = parseFloat(item.product.regular_price);
          const salesPrice = parseFloat(item.product.sales_price);
          const discountPercentage =
            regularPrice > salesPrice
              ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
              : 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/products/${item.product.slug}`}>
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={item.product.images[0] || "/assets/default.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                    {item.product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary font-bold">
                    ${item.product.sales_price}
                  </span>
                  {regularPrice > salesPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${item.product.regular_price}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeFromWishlist.isPending}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
