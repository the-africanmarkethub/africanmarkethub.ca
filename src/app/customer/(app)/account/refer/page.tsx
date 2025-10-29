"use client";

import { useState } from "react";
import { useReferralCode } from "@/hooks/customer/useReferralCode";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ReferPage() {
  const { data: referralData, error, isLoading } = useReferralCode();
  const [showModal, setShowModal] = useState(false);

  console.log("Referral Data:", referralData);

  const referralCode = referralData?.referral_code;

  const handleCopyCode = async () => {
    if (!referralCode) {
      toast.error("No referral code available");
      return;
    }
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleShare = () => {
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">
          <Gift size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to load referral code
        </h2>
        <p className="text-gray-600">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 bg-white p-6 rounded-lg shadow">
        <h1 className="text-[20px] font-medium text-gray-900 mb-2">
          Refer & Earn
        </h1>
      </div>
      <div className=" min-h-screen">
        {/* Header */}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Amount Earned */}
          <div className=" bg-white text-center py-[34px]">
            <div className="text-[28px] font-semibold text-gray-900 mb-2">
              240CAD
            </div>
            <div className="text-gray-600 text-base">You have earned</div>
          </div>

          {/* Invited Friends */}
          <div className="text-center py-[34px] bg-white">
            <div className="text-[28px] font-semibold text-gray-900 mb-2">
              2
            </div>
            <div className="text-gray-600 text-base">Invited Friends</div>
          </div>
        </div>

        {/* Refer & Earn Card */}
        <div className="bg-white rounded-lg p-8 text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-yellow-600" />
          </div>

          <h2 className="text-[20px] font-normal text-gray-900 mb-3">
            Refer & Earn
          </h2>
          <p className="text-gray-600 mb-8 text-sm max-w-md mx-auto">
            Your can get 299 CAD when you refer your friends
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="px-8 py-[18px] border border-[#9C5432] text-[#292929] hover:bg-gray-50 rounded-full"
            >
              Copy code
            </Button>

            <Button
              onClick={handleShare}
              className="px-8 py-[18px] bg-[#E7931A] text-white hover:bg-[#E7931A]/90 rounded-full"
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4">
                <Image
                  src="/img/African Market Hub.svg"
                  alt="African Market Hub"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-16 left-8 text-yellow-400">
              <div className="text-2xl">⭐</div>
            </div>
            <div className="absolute top-20 right-12 text-yellow-400">
              <div className="text-lg">⭐</div>
            </div>
            <div className="absolute top-32 left-12 text-yellow-400">
              <div className="text-xl">⭐</div>
            </div>
            <div className="absolute top-28 right-8 text-yellow-400">
              <div className="text-sm">⭐</div>
            </div>

            {/* Content */}
            <div className="text-center relative z-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                120 CAD off
              </h2>
              <p className="text-gray-600 mb-8">
                Friends can get $10 off—you&apos;ll get $10
                <br />
                when they place their first Cade
              </p>

              <Button
                onClick={() => setShowModal(false)}
                className="w-full bg-[#E7931A] text-white hover:bg-[#E7931A]/90 py-4 rounded-xl text-lg font-semibold"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
