"use client";

import { CouponForm } from "@/components/vendor/forms/coupon-form";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCouponPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const couponId = params.id as string;
  const [couponData, setCouponData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Get coupon data from URL params
      const encodedData = searchParams.get('data');
      if (encodedData) {
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);
        setCouponData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing coupon data from URL:', error);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E67E22] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading coupon data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!couponData) {
    return (
      <div className="flex-1 w-full p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No coupon data found. Please try again from the coupons list.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#E67E22] text-white rounded-md hover:bg-[#D35400]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-8">
      <CouponForm 
        couponId={couponId} 
        mode="edit" 
        initialData={couponData}
      />
    </div>
  );
}