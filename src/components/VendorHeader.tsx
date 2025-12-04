"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useLogout } from "@/hooks/useLogout";

export default function VendorHeader() {
  const { user } = useAuthGuard();
  const { logout } = useLogout();
  const pathname = usePathname();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/vendor") return "Dashboard";
    if (pathname.includes("/vendor/products")) return "Product Management";
    if (pathname.includes("/vendor/orders")) return "Order Management";
    if (pathname.includes("/vendor/customers")) return "Customer Feedback";
    if (pathname.includes("/vendor/finance")) return "Finance & Payment";
    if (pathname.includes("/vendor/analytics")) return "Analytics & Report";
    if (pathname.includes("/vendor/accounts")) return "Account & Settings";
    if (pathname.includes("/vendor/support")) return "Vendor Support";
    if (pathname.includes("/vendor/shop")) return "Shop Management";
    return "Dashboard";
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent w-64 xl:w-96"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11m-6 0v1a3 3 0 006 0v-1m-6 0h6"
                />
              </svg>
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-medium">
                    {user?.name || "John Doe"}
                  </p>
                  <p className="text-xs text-gray-500">Vendor</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#F28C0D] to-orange-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "J"}
                </div>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/vendor/accounts"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/vendor/shop"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Shop Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11m-6 0v1a3 3 0 006 0v-1m-6 0h6"
              />
            </svg>
            <span className="absolute top-1 right-1 block h-1.5 w-1.5 rounded-full bg-red-500"></span>
          </button>
          
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="relative h-8 w-8 rounded-full bg-gradient-to-r from-[#F28C0D] to-orange-600 flex items-center justify-center text-white font-bold text-sm"
          >
            {user?.name?.charAt(0) || "J"}
          </button>
        </div>
        
        {showUserDropdown && (
          <div className="absolute right-4 top-14 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
            <Link
              href="/vendor/accounts"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile Settings
            </Link>
            <Link
              href="/vendor/shop"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Shop Settings
            </Link>
            <hr className="my-1" />
            <button
              onClick={() => logout()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}