import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (couponCode: string) => void;
}

export default function CouponModal({ isOpen, onClose, onApplyCoupon }: CouponModalProps) {
  const [couponCode, setCouponCode] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim());
      setCouponCode("");
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white border border-gray-300 w-[400px] h-[142px] rounded-[32px] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Coupon</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="1233455555"
            className="w-full h-[46px] px-4 pr-24 bg-[#F8F8F8] border border-gray-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <Button
            onClick={handleApply}
            disabled={!couponCode.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-[#D4834A] hover:bg-[#C4734A] text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}