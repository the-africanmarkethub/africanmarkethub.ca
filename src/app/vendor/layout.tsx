"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { VendorSidebar } from "@/components/VendorSidebar";
import VendorHeader from "@/components/VendorHeader";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show sidebar and footer on create-shop page
  const shouldShowSidebar = !pathname.includes("/vendor/create-shop");
  const shouldShowFooter = !pathname.includes("/vendor/create-shop");

  if (!shouldShowSidebar) {
    // Create shop page - no sidebar, just the page content
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Other vendor pages - with responsive sidebar layout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <VendorSidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white">
              <VendorSidebar />
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Vendor Header */}
          <VendorHeader />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden fixed bottom-4 left-4 z-40 p-3 bg-[#F28C0D] text-white rounded-full shadow-lg hover:bg-orange-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>

      {shouldShowFooter && <Footer />}
    </div>
  );
}
