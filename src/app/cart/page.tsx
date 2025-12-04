"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartItems, useDeleteCartItem } from "@/hooks/useCart";

export default function CartPage() {
  const { data: cartData, isLoading, error } = useCartItems();
  const deleteCartItem = useDeleteCartItem();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleSelectAll = () => {
    if (!cartData?.data) return;

    if (selectedItems.size === cartData.data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartData.data.map((item) => item.id)));
    }
  };

  const handleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((itemId) => {
      deleteCartItem.mutate(itemId);
    });
    setSelectedItems(new Set());
  };

  const calculateTotals = () => {
    if (!cartData?.data) return { subtotal: 0, shipping: 0, total: 0 };

    const subtotal = cartData.data.reduce((sum, item) => {
      return sum + (parseFloat(item.subtotal) || 0);
    }, 0);

    const shipping = subtotal > 0 ? 400.5 : 0; // Fixed shipping fee
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateTotals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6 h-fit">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#F28C0D]">
              Home
            </Link>
            <span>›</span>
            <span className="text-gray-900">Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartData?.data && cartData.data.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Cart ({cartData.data.length})
              </h1>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === cartData.data.length &&
                      cartData.data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                  <span>Select all items</span>
                </label>
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete selected items
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartData.data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="flex items-center pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-5 h-5 text-[#F28C0D] border-gray-300 rounded"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/icon/auth.svg"}
                          alt={item.product.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="w-full flex justify-between">
                        <div className="flex-1 w-full min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <Link href={`/products/${item.product.slug}`}>
                                <h3 className="font-medium text-gray-900 hover:text-[#F28C0D] transition-colors line-clamp-2">
                                  {item.product.title}
                                </h3>
                              </Link>

                              <div className="mt-2 space-y-1">
                                {item.product.quantity > 0 ? (
                                  <p className="text-green-600 text-sm">
                                    ✓ In stock
                                  </p>
                                ) : (
                                  <p className="text-red-600 text-sm">
                                    ✗ Out of stock
                                  </p>
                                )}

                                {/* Color info if available */}
                                {item.product.variations &&
                                  item.product.variations.length > 0 && (
                                    <p className="text-sm text-gray-600">
                                      Color:{" "}
                                      {item.product.variations[0].color.name}
                                    </p>
                                  )}
                              </div>
                            </div>
                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${parseFloat(item.subtotal).toFixed(2)} CAD
                              </p>
                              {parseFloat(item.product.regular_price) >
                                parseFloat(item.product.sales_price) && (
                                <p className="text-sm text-gray-400 line-through">
                                  $
                                  {parseFloat(
                                    item.product.regular_price
                                  ).toFixed(2)}{" "}
                                  CAD
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex w-full items-center justify-between mt-4">
                            <div className="flex w-full text-[#464646] items-center space-x-2">
                              <button
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                onClick={() => {
                                  // Update quantity logic here
                                }}
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border border-gray-300 rounded text-center min-w-[3rem]">
                                {item.quantity}
                              </span>
                              <button
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                onClick={() => {
                                  // Update quantity logic here
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Actions */}
                            <div className="flex  items-center space-x-4">
                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
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
                              <button
                                onClick={() => deleteCartItem.mutate(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex text-gray-600 justify-between text-sm">
                    <span className="">Subtotal</span>
                    <span className="font-medium">
                      ${subtotal.toFixed(2)} CAD
                    </span>
                  </div>

                  {/* <div className="flex text-gray-600 justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium">
                      ${shipping.toFixed(2)} CAD
                    </span>
                  </div> */}

                  <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Coupon</span>
                    <button className="text-[#F28C0D] text-sm hover:underline">
                      + Apply Coupon
                    </button>
                  </div>

                  <div className="flex text-gray-600 justify-between text-sm">
                    <span className="">Tax</span>
                    <span className="font-medium">50.15 CAD</span>
                  </div>

                  <div className="border-t text-gray-600 border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(total + 50.15).toFixed(2)} CAD</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full bg-[#F28C0D] text-white py-3 rounded-full font-medium hover:opacity-90 transition-colors mt-6">
                      Proceed to checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Frequently Bought Together */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Frequently bought together
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Placeholder for related products */}
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm p-4"
                  >
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Ankara gown
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold">141.19 CAD</span>
                      <span className="text-sm text-gray-400 line-through">
                        141.19 CAD
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        60%
                      </span>
                    </div>
                    <button className="w-full bg-[#F28C0D] text-white py-2 rounded-full text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-[#F28C0D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty!
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            <Link href="/recommended">
              <button className="bg-[#F28C0D] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-colors">
                Explore Items
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
