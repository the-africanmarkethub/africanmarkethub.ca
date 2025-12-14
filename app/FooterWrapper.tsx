"use client";

import { useAuthStore } from "@/store/useAuthStore";
import SplashScreen from "./components/SplashScreen";
import Footer from "./components/Footer";

export default function FooterWrapper() {
  const { user, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) return <SplashScreen />;

  const isVendorAuthenticated = user && user?.role === "vendor";

  if (isVendorAuthenticated) {
    return <SplashScreen />; 
  }

  return <Footer />;
}