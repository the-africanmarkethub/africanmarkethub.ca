"use client";

import { Shop } from "@/interfaces/shop";
import { LuShoppingBag, LuExternalLink } from "react-icons/lu";
import { retryOnboardingStatus } from "@/lib/api/seller/shop";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

interface ShopHeaderCardProps {
  shop: Shop;
  subtitle?: string;
}

export default function ShopHeaderCard({
  shop,
  subtitle,
}: ShopHeaderCardProps) {
  const [loading, setLoading] = useState(false);

  // Logic: Show alert if onboarding is not true OR payouts are disabled
  const showStripeAlert =
    !shop.stripe_onboarding_completed || !shop.stripe_payouts_enabled;

  const handleRetryOnboarding = async () => {
    try {
      setLoading(true);
      const res = await retryOnboardingStatus();
      if (res.onboarding_url) {
        // Redirect vendor to Stripe to finish the process
        window.location.href = res.onboarding_url;
      } else {
        toast.success("Account status updated!");
      }
    } catch (error) {
      toast.error("Failed to connect to Stripe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Stripe Warning Alert */}
      {showStripeAlert && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Action Required: Complete Stripe Setup
              </p>
              <p className="text-xs text-amber-700">
                {shop.stripe_requirements && shop.stripe_requirements.length > 0
                  ? `Missing: ${shop.stripe_requirements.join(", ")}`
                  : "Finish onboarding to enable payouts for your services."}
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryOnboarding}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Complete Setup"}
            <LuExternalLink size={14} />
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="card p-4 border border-slate-200 rounded-md bg-white shadow-sm">
        {/* <div className="flex items-start gap-3"> */}
          <Link
            href={`https://africanmarkethub.ca/shops/${shop.slug}`}
            className="flex items-start gap-3"
            title='Checkout your store'
            target="_blank"
          >
            {" "}

            <div className="rounded-md bg-green-50 p-2 h-10 w-10 flex items-center justify-center border border-green-100">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <LuShoppingBag className="text-hub-secondary" size={22} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {shop.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {subtitle ?? "Manage and update your shop details from here."}
              </p>
            </div>
          </Link>
        {/* </div> */}
      </div>
    </div>
  );
}
