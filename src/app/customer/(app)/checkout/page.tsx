"use client";

import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { useCart } from "@/contexts/customer/CartContext";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import ShippingInformation from "@/components/customer/checkout/ShippingInformation";
import CheckoutSummary from "@/components/customer/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();

  // Only use the selected address, no default fallback
  const addressId = selectedAddressId;

  if (cartItems.length === 0) {
    return (
      <MaxWidthWrapper className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          You need to add items to your cart before you can checkout.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark"
        >
          Return to Shop
        </Link>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-12">
      <div className="flex items-center gap-1 text-sm text-[#292929] mb-8">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight width={20} height={20} />
        <Link href="/cart" className="hover:text-primary">
          Cart
        </Link>
        <ChevronRight width={20} height={20} />
        <span className="text-primary">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <ShippingInformation onAddressSelect={setSelectedAddressId} />
        </div>
        <div>
          <CheckoutSummary addressId={addressId} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
