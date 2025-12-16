"use client";

import Image from "next/image";
import {
  TrashIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { CartItem, useCart } from "@/context/CartContext";
import { useState } from "react";
import Modal from "../components/common/Modal";
import verifyCoupon from "@/lib/api/customer/coupon";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Coupon from "@/interfaces/coupon";
import { ClipLoader } from "react-spinners";
import { formatAmount } from "@/utils/formatCurrency";
import { getStockStatus } from "@/utils/ItemUtils";

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>();

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const subtotal = cart.reduce(
    (sum: number, item: CartItem) =>
      sum + Number(item.price) * Number(item.qty),
    0
  );
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyCoupon(couponCode);

      if (res?.status === "error") {
        setError(res.message || "Invalid or expired coupon code");
        toast.error(res.message || "Invalid or expired coupon code");
        return;
      }

      if (res?.is_active && res.discount) {
        const { discount_rate, discount_type } = res.discount;

        let calculatedDiscount = 0;
        if (discount_type === "fixed") {
          calculatedDiscount = Number(discount_rate);
        } else if (discount_type === "percentage") {
          calculatedDiscount = (subtotal * Number(discount_rate)) / 100;
        }

        setDiscount(calculatedDiscount);
        setAppliedCoupon(res.discount);
        setShowCouponModal(false);
      } else {
        setError("Invalid or expired coupon code");
      }
    } catch {
      setError("Failed to apply coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleProceedToShipping = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {/* Empty Cart SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2410c" /* Matches orange-800-ish tone */
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-6"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          {/* This font size (text-2xl) is fine for empty states even on mobile */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>

          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
            onClick={() => router.push("/items")}
            className="px-6 py-3 bg-orange-800 text-white rounded-full font-medium hover:bg-orange-700 transition cursor-pointer"
          >
            Explore Marketplace
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {/* Reduced mobile size to text-lg, scales up to text-xl on small screens and above */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 bg-white p-4 rounded-xl shadow">
              Your Cart ({cart.length})
            </h2>

            {cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <div>
                    {/* Prioritizes text-sm on mobile, scales up to text-lg on sm screens and above */}
                    <h3
                      title={item.title}
                      className="text-sm sm:text-lg font-medium text-gray-800 line-clamp-1"
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
                        getStockStatus(item.qty).bgClass
                      }`}
                    >
                      {getStockStatus(item.qty).text}
                    </span>
                    {/* Quantity controls use standard text-sm which works well on mobile */}
                    <div className="flex items-center gap-2 mt-2 text-orange-800">
                      <button
                        aria-label="quantity reduce"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-orange-100 text-orange-800"
                      >
                        <MinusIcon
                          aria-label="Reduce icon"
                          className="w-3 h-3"
                        />
                      </button>
                      <span className="text-sm font-medium">{item.qty}</span>
                      <button
                        aria-label="quantity increase"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-orange-100 text-orange-800"
                      >
                        <PlusIcon
                          aria-label="Increase icon"
                          className="w-3 h-3"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full">
                  {/* Prioritizes text-base on mobile, scales up to text-lg on sm screens and above */}
                  <span className="text-base sm:text-lg font-semibold text-gray-800">
                    {formatAmount(Number(item.price) * Number(item.qty))}
                  </span>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setItemToDelete(item.id)}
                      className="p-2 hover:text-orange-800"
                    >
                      <TrashIcon
                        aria-label="Trash icon"
                        className="h-5 w-5 cursor-pointer text-gray-500 hover:text-red-500 "
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
            {/* Summary title standard text-lg, appropriate for mobile sidebar */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Summary
            </h3>
            {/* Standard text-sm for details */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatAmount(subtotal)}</span>
              </div>

              {discount > 0 && appliedCoupon && (
                <div className="flex justify-between text-orange-800 font-medium">
                  <span>
                    Discount ({appliedCoupon.discount_code} -{" "}
                    {appliedCoupon.discount_type})
                  </span>
                  <span>- {formatAmount(discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Coupon</span>
                <button
                  className="text-orange-800 font-medium cursor-pointer"
                  onClick={() => setShowCouponModal(true)}
                >
                  {discount > 0 ? "Change Coupon" : "Apply Coupon"}
                </button>
              </div>

              <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>{formatAmount(total)}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToShipping}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-full font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-800 hover:bg-orange-800 text-white cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Proceed to Shipping"
              )}
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        title="Apply Coupon"
        description="Enter the coupon code to apply"
      >
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="input text-gray-500!"
          placeholder="Enter coupon code"
        />

        {error && <p className="text-orange-800 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowCouponModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode}
            className="px-4 py-2 bg-orange-800 text-white rounded-md hover:bg-orange-800 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </Modal>
    </div>
  );


}
