"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthStore } from "@/store/useAuthStore";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { getMyShop, retryOnboardingStatus } from "@/lib/api/seller/shop";

// Define strict states for the layout
type LayoutStatus =
  | "hydrating"
  | "unauthenticated"
  | "validating"
  | "authorized";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [status, setStatus] = useState<LayoutStatus>("hydrating");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // 1. Wait for Store
    if (!_hasHydrated) return;

    // 2. Auth Check
    if (!token) {
      setStatus("unauthenticated");
      router.replace("/login"); // replace is better for auth redirects to clean history
      return;
    }

    // 3. Start Validation
    setStatus("validating");

    const validateShop = async () => {
      try {
        const response = await getMyShop();
        const shop = response.data;

        // Sequence of business logic redirects
        if (!shop.subscription_id) {
          router.replace("/subscription");
          return;
        }

        if (!shop.stripe_connect_id) {
          window.location.href = response.stripe_onboarding_url;
          return;
        }

        if (!shop.stripe_onboarding_completed) {
          const retry = await retryOnboardingStatus();
          window.location.href = retry.onboarding_url;
          return;
        }

        // Final Success State
        setStatus("authorized");
      } catch (error: any) {
        console.error("Seller validation error:", error);
        if (error.response?.status === 401) {
          router.replace("/login");
        } else {
          router.replace("/seller-onboarding");
        }
      }
    };

    validateShop();
  }, [_hasHydrated, token, router]);

  // --- RENDER PATTERN (Production Grade Switch) ---

  switch (status) {
    case "hydrating":
      return <FullScreenLoader message="Initializing African Market Hub..." />;

    case "unauthenticated":
      return (
        <FullScreenLoader message="Security check: Redirecting to login..." />
      );

    case "validating":
      return <FullScreenLoader message="Verifying your shop status..." />;

    case "authorized":
      return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
          )}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 p-3 overflow-y-auto md:p-8">
              {children}
            </main>
          </div>
        </div>
      );
  }
}

function FullScreenLoader({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <PulseLoader color="#016134" size={12} />
        <p className="text-sm font-medium text-gray-500 animate-pulse tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}
