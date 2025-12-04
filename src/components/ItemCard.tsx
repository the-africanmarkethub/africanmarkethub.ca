"use client";

import Image from "next/image";
import Link from "next/link";
import { useIsInWishlist, useAddToWishlist, useDeleteFromWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

interface ItemCardProps {
  id: number | string;
  title: string;
  slug?: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  image: string;
  discount?: string;
  type?: "product" | "service";
  isService?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ItemCard({
  id,
  title,
  slug,
  price,
  originalPrice,
  rating = 5,
  image,
  discount,
  type = "product",
  isService = false,
  onAddToCart,
  onAddToWishlist,
}: ItemCardProps) {
  const productId = typeof id === 'string' ? parseInt(id) : id;
  const { isInWishlist, wishlistItem } = useIsInWishlist(productId);
  const addToWishlist = useAddToWishlist();
  const deleteFromWishlist = useDeleteFromWishlist();

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
      onAddToWishlist?.();
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const CardContent = (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddToCart?.();
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title={type === "service" ? "Book Service" : "Add to Cart"}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleWishlistToggle();
            }}
            className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Add to Wishlist"
          >
            <svg
              className={`w-5 h-5 ${
                isInWishlist ? "text-red-500" : "text-gray-600"
              }`}
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
          </button>
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {discount}
            </span>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{title}</h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">{renderStars(rating)}</div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // If slug is provided, wrap in Link for navigation
  if (slug) {
    const href = isService ? `/services/${slug}` : `/products/${slug}`;
    return <Link href={href}>{CardContent}</Link>;
  }

  // Otherwise, return just the card content
  return CardContent;
}
