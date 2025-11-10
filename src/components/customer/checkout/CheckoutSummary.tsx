"use client";

import { useCart } from "@/contexts/customer/CartContext";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "../SubmitButton";
import { useCheckout } from "@/hooks/customer/useCheckout";
import { useGetCart } from "@/hooks/customer/useCart";
import { ExternalLink, QrCode, X } from "lucide-react";
import CouponModal from "./CouponModal";

interface CheckoutSummaryProps {
  addressId?: number;
}

export default function CheckoutSummary({ addressId }: CheckoutSummaryProps) {
  // For now, let's use the full cart. This will be updated to use selected items.
  const { cartItems } = useCart();
  const { data: cartData } = useGetCart();
  const { mutate: checkout, isPending, data: checkoutData } = useCheckout();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

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

  const handleApplyCoupon = (couponCode: string) => {
    // Handle coupon application logic here
    console.log("Applied coupon:", couponCode);
    // You can add API call or state management here
  };

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
    }, {
      onSuccess: (data) => {
        if (data.status === 'success' && (data.payment_link || data.payment_qr_code)) {
          setShowPaymentModal(true);
        }
      }
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
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Coupon</span>
          <Button
            variant="ghost"
            onClick={() => setShowCouponModal(true)}
            className="text-xs h-auto p-0 text-primary hover:text-primary font-normal"
          >
            + Add Coupon
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

      {/* Payment Modal */}
      {showPaymentModal && checkoutData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Select how you would like to complete your payment
            </p>

            <div className="space-y-3">
              {checkoutData.payment_link && (
                <Button
                  onClick={() => window.open(checkoutData.payment_link, '_blank')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Pay with Link
                </Button>
              )}
              
              {checkoutData.payment_qr_code && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Create QR code image and show it
                    const qrWindow = window.open('', '_blank');
                    if (qrWindow) {
                      qrWindow.document.write(`
                        <html>
                          <head><title>Payment QR Code</title></head>
                          <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
                            <div style="text-align:center;">
                              <h2>Scan to Pay</h2>
                              <img src="${checkoutData.payment_qr_code}" alt="Payment QR Code" style="max-width:300px;" />
                              <p>Scan this QR code with your mobile banking app</p>
                            </div>
                          </body>
                        </html>
                      `);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  Pay with QR Code
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Your payment is secured by Interac e-Transfer
            </p>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onApplyCoupon={handleApplyCoupon}
      />
    </div>
  );
}
