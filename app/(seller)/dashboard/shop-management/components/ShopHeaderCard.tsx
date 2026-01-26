"use client";

import { Shop } from "@/interfaces/shop";
import { LuShoppingBag, LuExternalLink } from "react-icons/lu";
import { retryOnboardingStatus } from "@/lib/api/seller/shop";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

interface ShopHeaderCardProps {
  shop: Shop | any;
  subtitle?: string;
}

export default function ShopHeaderCard({
  shop,
  subtitle,
}: ShopHeaderCardProps) {
  const [loading, setLoading] = useState(false);

  // 1. Safely check if we have a shop and if it needs Stripe attention
  // If shop is null/undefined, showStripeAlert becomes false (silent)
  const isExistingShop = !!shop?.id;

  const showStripeAlert =
    isExistingShop &&
    (shop.stripe_onboarding_completed === false ||
      shop.stripe_payouts_enabled === false);

  // 2. Determine exactly which state they are in for the UI text
  const needsOnboarding = isExistingShop && !shop.stripe_onboarding_completed;
  const isPendingVerification =
    isExistingShop &&
    shop.stripe_onboarding_completed &&
    !shop.stripe_payouts_enabled;

  const handleRetryOnboarding = async () => {
    try {
      setLoading(true);
      const res = await retryOnboardingStatus();
      if (res?.onboarding_url) {
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

  // If there is no shop at all (brand new seller), we skip the alert and show a simpler card
  if (!isExistingShop) {
    return (
      <div className="card p-4 border border-dashed border-slate-300 rounded-md bg-slate-50 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome to African Market Hub!
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please complete the form below to create your shop.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Stripe Warning Alert - Only shows for existing shops needing setup */}
      {showStripeAlert && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-md shadow-sm">
          <div className="flex items-center gap-3">
            <FiAlertTriangle
              className="text-amber-600 shrink-0"
              size={20}
            />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {needsOnboarding
                  ? "Action Required: Complete Stripe Setup"
                  : "Account Pending: Payouts Restricted"}
              </p>
              <p className="text-xs text-amber-700">
                {needsOnboarding
                  ? "Finish onboarding to enable payouts for your services."
                  : "Stripe is verifying your details. This usually takes 24-48 hours."}
              </p>
            </div>
          </div>

          {needsOnboarding && (
            <button
              onClick={handleRetryOnboarding}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Complete Setup"}
              <LuExternalLink size={14} />
            </button>
          )}
        </div>
      )}

      {/* Main Header Card */}
      <div className="card p-4 border border-slate-200 rounded-md bg-white shadow-sm">
        <Link
          href={`https://africanmarkethub.ca/shops/${shop?.slug}`}
          className="flex items-start gap-3"
          title="View your store"
          target="_blank"
        >
          <div className="rounded-md bg-green-50 p-2 h-10 w-10 flex items-center justify-center border border-green-100 shrink-0">
            {shop?.logo ? (
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
              {shop?.name || "Unnamed Shop"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {subtitle ?? "Manage and update your shop details from here."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
