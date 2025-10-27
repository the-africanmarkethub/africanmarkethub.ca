"use client";

import { CartItem } from "@/types/customer/cart.types";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartSummary({ cart }: { cart: CartItem[] }) {
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      // Skip items without product data (still loading)
      if (!item.product) {
        return acc;
      }

      // Get the correct price (either from variation or product)
      console.log("item", item);
      let price = 0;
      if (item.product?.variations && item.color_id && item.size_id) {
        const variation = item.product.variations.find(
          (v) => v.color_id === item.color_id && v.size_id === item.size_id
        );
        price =
          typeof variation?.price === "string"
            ? parseFloat(variation.price)
            : variation?.price || 0;
      } else {
        price = parseFloat(item.product?.sales_price || "0");
      }

      // Calculate subtotal for this item
      const itemSubtotal = price * item.quantity;
      return acc + itemSubtotal;
    }, 0);
  }, [cart]);

  const taxRate = 0.05; // 5% tax
  const shippingFee = 40.0;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + shippingFee;

  return (
    <div className="w-full p-4 md:p-6 bg-white md:bg-gray-50 rounded-lg h-fit border md:border-0">
      <h2 className="text-base md:text-xl font-semibold mb-4">Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm md:text-base text-gray-600">Subtotal</span>
          <span className="text-sm md:text-base font-medium">
            {subtotal.toFixed(2)} CAD
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm md:text-base text-gray-600">
            Shipping Fee:
          </span>
          <span className="text-sm md:text-base font-medium">
            {shippingFee.toFixed(2)} CAD
          </span>
        </div>

        {/* Mobile Coupon Design */}
        <div className="md:hidden flex justify-between items-center">
          <span className="text-sm text-gray-600">Coupon</span>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            <span className="text-base">+</span> Add Coupon
          </button>
        </div>

        {/* Desktop Coupon Design */}
        <div className="hidden md:block relative py-2">
          <input
            type="text"
            placeholder="Apply Coupon"
            className="w-full pr-24 py-2 px-3 border rounded-full"
          />
          <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-xs h-8">
            Apply
          </Button>
        </div>

        <div className="flex justify-between">
          <span className="text-sm md:text-base text-gray-600">Tax</span>
          <span className="text-sm md:text-base font-medium">
            {taxes.toFixed(2)} CAD
          </span>
        </div>

        <div className="border-t my-3"></div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-base md:text-lg">Total</span>
          <span className="font-bold text-base md:text-xl">
            {total.toFixed(2)} CAD
          </span>
        </div>
      </div>

      <Link href="/checkout" className="w-full block">
        <Button
          className="w-full text-sm md:text-base mt-4 md:mt-6 rounded-full bg-primary hover:bg-primary-dark"
          size="lg"
          disabled={cart.length === 0}
        >
          Proceed to checkout
        </Button>
      </Link>
    </div>
  );
}
