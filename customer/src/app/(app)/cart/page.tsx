"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import RecommendedForYou from "@/components/cart/RecommendedForYou";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, isLoading, isSyncing, deleteCartItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    // Initially select all items when the cart loads
    setSelectedItems(cartItems.map((item) => item.id));
  }, [cartItems]);

  const isEmpty = cartItems.length === 0;

  const areAllItemsSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelection = (itemId: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((id) => {
      deleteCartItem(id);
    });
    setSelectedItems([]);
  };

  return (
    <MaxWidthWrapper className="mt-12 md:mt-8 mb-10 md:mb-20">
      <div className="flex items-center gap-1 mb-6 md:mb-[46px] text-xs md:text-sm text-[#292929]">
        <Link href="/" className="hover:text-primary text-gray-500">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 md:w-5 md:h-5 text-gray-400" />
        <span className="text-primary font-medium">Cart</span>
      </div>

      {isLoading || isSyncing ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading Cart...</p>
        </div>
      ) : isEmpty ? (
        <div className="text-center bg-[#FFFFFF] py-20">
          <Image
            src="/img/empty-cart.svg"
            alt="Empty Cart"
            width={120}
            height={120}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark"
          >
            Explore Items
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8 items-start mt-4 md:mt-8">
            <div className="w-full lg:col-span-2 bg-white rounded-lg md:shadow-sm">
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  Your Cart ({cartItems.length})
                </h1>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-b border-gray-200 py-3 gap-3 md:gap-0">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="select-all"
                      checked={areAllItemsSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAll(Boolean(checked))
                      }
                      aria-label="Select all items"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm text-gray-600"
                    >
                      Select all items
                    </label>
                  </div>
                  <Separator orientation="vertical" className="hidden md:block" />
                  <Button
                    variant="link"
                    className="text-sm text-red-500 hover:text-red-700 p-0 h-auto disabled:opacity-50 disabled:no-underline self-start md:self-center"
                    disabled={selectedItems.length === 0}
                    onClick={handleDeleteSelected}
                  >
                    Delete selected items
                  </Button>
                </div>
              </div>
              <div className="px-4 md:px-6">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelectionChange={handleItemSelection}
                    isLastItem={index === cartItems.length - 1}
                  />
                ))}
              </div>
            </div>
            <CartSummary
              cart={cartItems.filter((item) => selectedItems.includes(item.id))}
            />
          </div>
        </>
      )}

      <RecommendedForYou />
    </MaxWidthWrapper>
  );
}
