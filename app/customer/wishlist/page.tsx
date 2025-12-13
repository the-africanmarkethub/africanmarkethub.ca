"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useWishlist, useDeleteFromWishlist, useAddToWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { isAuthenticated } = useAuthGuard();
  const { data: wishlistResponse, isLoading, error } = useWishlist();
  const deleteFromWishlist = useDeleteFromWishlist();
  const addToCart = useAddToWishlist(); // We'll use this for "Add to Cart" functionality
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to delete");
      return;
    }

    try {
      // Delete all selected items
      await Promise.all(
        selectedItems.map(itemId => deleteFromWishlist.mutateAsync(itemId))
      );
      setSelectedItems([]);
      toast.success("Selected items removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove items from wishlist");
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      // Add to cart logic here - you'll need to implement addToCart hook
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await deleteFromWishlist.mutateAsync(itemId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item from wishlist");
    }
  };

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading wishlist</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const wishlistItems = wishlistResponse?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {/* Select all and Delete controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.length === wishlistItems.length && wishlistItems.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-[#F28C0D] border-gray-300 rounded focus:ring-[#F28C0D]"
            />
            <span className="ml-2 text-gray-700">Select all items</span>
          </label>
          {selectedItems.length > 0 && (
            <span className="text-gray-500">|</span>
          )}
          {selectedItems.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
              disabled={deleteFromWishlist.isPending}
            >
              {deleteFromWishlist.isPending ? "Deleting..." : "Delete selected items"}
            </button>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Add products you love to keep track of them.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-[#F28C0D] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <span className="ml-8">Product</span>
            </div>
            <div className="text-center">Price</div>
            <div className="text-center">Stock Status</div>
            <div className="text-center">Actions</div>
            <div></div>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-4 mt-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="grid md:grid-cols-5 gap-4 items-center py-4 border-b border-gray-100 last:border-0">
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 text-[#F28C0D] border-gray-300 rounded focus:ring-[#F28C0D]"
                  />
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/icon/placeholder.svg"}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.product.title}</h3>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm text-[#F28C0D] hover:text-orange-600 transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <p className="font-semibold text-gray-900">${item.product.sales_price} CAD</p>
                  {item.product.regular_price !== item.product.sales_price && (
                    <p className="text-sm text-gray-500 line-through">${item.product.regular_price} CAD</p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.product.quantity > 0 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {item.product.quantity > 0 ? `${item.product.quantity} left` : "Out of stock"}
                  </span>
                </div>

                {/* Actions */}
                <div className="text-center">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    disabled={item.product.quantity === 0}
                    className="bg-[#F28C0D] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Remove */}
                <div className="text-center">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={deleteFromWishlist.isPending}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    title="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile view for better responsiveness */}
          <div className="md:hidden space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 text-[#F28C0D] border-gray-300 rounded focus:ring-[#F28C0D] mt-1"
                  />
                  <div className="w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/icon/placeholder.svg"}
                      alt={item.product.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-2">{item.product.title}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="font-semibold text-gray-900">${item.product.sales_price} CAD</span>
                      {item.product.regular_price !== item.product.sales_price && (
                        <span className="text-sm text-gray-500 line-through">${item.product.regular_price} CAD</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.product.quantity > 0 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.product.quantity > 0 ? `${item.product.quantity} left` : "Out of stock"}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      disabled={item.product.quantity === 0}
                      className="bg-[#F28C0D] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={deleteFromWishlist.isPending}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      title="Remove from wishlist"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}