"use client";

import Coupon from "@/interfaces/coupon";
import { formatAmount } from "@/utils/formatCurrency";

type Props = {
  subtotal: number;
  total: number;
  discount: number;
  appliedCoupon?: Coupon;
  loading: boolean;
  hasOutOfStock: boolean;
  setShowCouponModal: (show: boolean) => void;
  handleProceedToShipping: () => void;
};

export default function CartSummary({
  subtotal,
  total,
  discount,
  appliedCoupon,
  loading,
  hasOutOfStock,
  setShowCouponModal,
  handleProceedToShipping,
}: Props) {
  return (
    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
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
        disabled={loading || hasOutOfStock}
        className={`mt-6 w-full py-3 rounded-full font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-800 hover:bg-orange-800 text-white cursor-pointer"
        }`}
      >
        {loading ? "Processing..." : "Proceed to Shipping"}
      </button>
    </div>
  );
}
