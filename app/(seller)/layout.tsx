"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { getMyShop } from "@/lib/api/seller/shop";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(true); // New state for shop check

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const validateShopStatus = async () => {
      // 1. First, check if auth has hydrated and token exists
      if (!_hasHydrated) return;
      
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        // 2. Fetch Shop Details from Backend
        const response = await getMyShop();
        const shop = response.data;
        console.log(shop);
        // 3. Logic: Check Subscription
        if (!shop.subscription_id) {
          router.replace("/subscription");
          return;
        }

        // 4. Logic: Check Stripe Connection
        if (!shop.stripe_connect_id) {
          // If you have a specific onboarding URL from backend, use that
          // Otherwise, redirect to a internal "connect-stripe" page or external link
          window.location.href = shop.stripe_onboarding_url || "https://connect.stripe.com/setup/s/...";
          return;
        }

        // 5. If everything is fine, stop the loader
        setIsValidating(false);
      } catch (error) {
        console.error("Shop validation failed:", error);
        router.replace("/seller-onboarding"); 
      }
    };

    validateShopStatus();
  }, [token, _hasHydrated, router]);

  // Show loader while Hydrating OR while fetching shop data
  if (!_hasHydrated || !token || isValidating) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <PulseLoader color="#ff6600" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">
            Verifying shop status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-3 md:p-8">{children}</main>
      </div>
    </div>
  );
}