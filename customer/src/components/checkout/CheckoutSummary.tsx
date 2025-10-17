"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "../SubmitButton";
import { useCheckout } from "@/hooks/useCheckout";
import { useGetCart } from "@/hooks/useCart";

interface CheckoutSummaryProps {
  addressId?: number;
}

export default function CheckoutSummary({ addressId }: CheckoutSummaryProps) {
  // For now, let's use the full cart. This will be updated to use selected items.
  const { cartItems } = useCart();
  const { data: cartData } = useGetCart();
  const { mutate: checkout, isPending } = useCheckout();

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      let price = 0;
      if (item.product.variations && item.color_id && item.size_id) {
        const variation = item.product.variations.find(
          (v) => v.color_id === item.color_id && v.size_id === item.size_id
        );
        price =
          typeof variation?.price === "string"
            ? parseFloat(variation.price)
            : variation?.price || 0;
      } else {
        price = parseFloat(item.product.sales_price);
      }
      const itemSubtotal = price * item.quantity;
      return acc + itemSubtotal;
    }, 0);
  }, [cartItems]);

  const taxRate = 0.05; // 5% tax
  const shippingFee = subtotal > 0 ? 40.0 : 0;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + shippingFee;

  const handlePlaceOrder = () => {
    // Check if we have a valid address ID
    if (!addressId || !cartData?.data) {
      return;
    }

    // Extract order IDs from cart data
    const orderItemIds = cartData.data.map((item: any) => item.id);

    checkout({
      order_item_id: orderItemIds,
      address_id: addressId,
    });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg h-fit sticky top-28">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image
                  src={item.product.images[0] || "/assets/default.png"}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm">
                <p className="font-medium">{item.product.title}</p>
                <p className="text-gray-500">x{item.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              {(parseFloat(item.product.sales_price) * item.quantity).toFixed(
                2
              )}{" "}
              CAD
            </p>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{subtotal.toFixed(2)} CAD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping Fee</span>
          <span>{shippingFee.toFixed(2)} CAD</span>
        </div>
        <div className="relative py-2">
          <input
            type="text"
            placeholder="Apply Coupon"
            className="w-full pr-24 py-2 px-3 border rounded-full text-sm"
          />
          <Button
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-xs h-8 text-primary hover:text-primary"
          >
            Add Coupon
          </Button>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>{taxes.toFixed(2)} CAD</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>{total.toFixed(2)} CAD</span>
        </div>

        <div className="mt-8">
          <SubmitButton
            className="h-[52px] w-full rounded-4xl p-4"
            onClick={handlePlaceOrder}
            disabled={isPending || cartItems.length === 0 || !addressId}
          >
            {isPending
              ? "Placing Order..."
              : !addressId
                ? "Select Address to Continue"
                : "Place Order"}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
