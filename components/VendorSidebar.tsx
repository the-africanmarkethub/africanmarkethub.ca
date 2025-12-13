"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { useVendorShops } from "@/hooks/useVendorShops";

export function VendorSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { data: shopsData } = useVendorShops();

  // Determine shop type for dynamic Product/Service Management
  const shopType = shopsData?.shops?.[0]?.type || "products";
  const managementLabel =
    shopType === "services" ? "Service Management" : "Product Management";
  const orderManagementLabel =
    shopType === "services" ? "Booking Management" : "Order Management";
  const orderManagementPath =
    shopType === "services" ? "/vendor/bookings" : "/vendor/orders";

  // State for expanding/collapsing menu sections
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <Link href="/">
          <Image
            src="/icon/logo.svg"
            alt="African Market Hub"
            width={150}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-2">
          <Link
            href="/vendor"
            className={`${
              pathname === "/vendor"
                ? "bg-orange-50 text-[#F28C0D]"
                : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Dashboard
          </Link>

          <div>
            <button
              onClick={() => toggleSection("management")}
              className={`${
                pathname.startsWith("/vendor/products")
                  ? "bg-orange-50 text-[#F28C0D]"
                  : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
              } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
              {managementLabel}
              <svg
                className={`ml-auto h-4 w-4 transform transition-transform ${
                  expandedSections.includes("management") ? "rotate-90" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {expandedSections.includes("management") && (
              <div className="ml-6 mt-2 space-y-1">
                <Link
                  href="/vendor/products"
                  className={`${
                    pathname === "/vendor/products"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  All {shopType === "services" ? "Services" : "Products"}
                </Link>
                <Link
                  href="/vendor/products/add"
                  className={`${
                    pathname === "/vendor/products/add"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Add New
                </Link>
                <Link
                  href="/vendor/products/promotion"
                  className={`${
                    pathname.includes("/vendor/products/promotion")
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Product Promotion
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => toggleSection("orders")}
            className={`${
              pathname.startsWith(orderManagementPath)
                ? "bg-orange-50 text-[#F28C0D]"
                : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
            } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  shopType === "services"
                    ? "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                }
              />
            </svg>
            {orderManagementLabel}
            <svg
              className={`ml-auto h-4 w-4 transform transition-transform ${
                expandedSections.includes("orders") ? "rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {expandedSections.includes("orders") && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                href={orderManagementPath}
                className={`${
                  pathname === orderManagementPath
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                {shopType === "services" ? "All Bookings" : "All Orders"}
              </Link>
              {/* <Link
                href={`${orderManagementPath}/pending`}
                className={`${
                  pathname === `${orderManagementPath}/pending`
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                Pending
              </Link>
              <Link
                href={`${orderManagementPath}/${shopType === "services" ? "processing" : "shipped"}`}
                className={`${
                  pathname === `${orderManagementPath}/${shopType === "services" ? "processing" : "shipped"}`
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                {shopType === "services" ? "Processing" : "Shipped"}
              </Link> */}
            </div>
          )}

          <button
            onClick={() => toggleSection("feedback")}
            className={`${
              pathname.startsWith("/vendor/feedback") ||
              pathname.startsWith("/vendor/customer-messages")
                ? "bg-orange-50 text-[#F28C0D]"
                : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
            } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Customer Feedback
            <svg
              className={`ml-auto h-4 w-4 transform transition-transform ${
                expandedSections.includes("feedback") ? "rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {expandedSections.includes("feedback") && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                href="/vendor/customer-messages"
                className={`${
                  pathname === "/vendor/customer-messages"
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                Customer Messages
              </Link>
              <Link
                href="/vendor/ratings-reviews"
                className={`${
                  pathname === "/vendor/ratings-reviews"
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                Ratings & Reviews
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <button
              onClick={() => toggleSection("finance")}
              className={`${
                pathname.startsWith("/vendor/finance")
                  ? "bg-orange-50 text-[#F28C0D]"
                  : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
              } group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Finance & Payment
              </div>
              <svg
                className={`h-4 w-4 transition-transform ${
                  expandedSections.includes("finance")
                    ? "transform rotate-90"
                    : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {expandedSections.includes("finance") && (
            <div className="ml-11 space-y-1 mb-2">
              <Link
                href="/vendor/finance"
                className={`${
                  pathname === "/vendor/finance"
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                Earning Overview
              </Link>
              <Link
                href="/vendor/finance/withdrawal"
                className={`${
                  pathname === "/vendor/finance/withdrawal"
                    ? "text-[#F28C0D] bg-orange-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } block px-3 py-1 text-sm rounded-md transition-colors`}
              >
                Withdrawal
              </Link>
            </div>
          )}

          <Link
            href="/vendor/analytics"
            className={`${
              pathname === "/vendor/analytics"
                ? "bg-orange-50 text-[#F28C0D]"
                : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics & Report
          </Link>

          <div>
            <button
              onClick={() => toggleSection("settings")}
              className={`${
                pathname.startsWith("/vendor/settings")
                  ? "bg-orange-50 text-[#F28C0D]"
                  : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
              } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Accounts & Settings
              <svg
                className={`ml-auto h-4 w-4 transform transition-transform ${
                  expandedSections.includes("settings") ? "rotate-90" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {expandedSections.includes("settings") && (
              <div className="ml-6 mt-2 space-y-1">
                <Link
                  href="/vendor/settings"
                  className={`${
                    pathname === "/vendor/settings"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Profile Settings
                </Link>
                <Link
                  href="/vendor/settings/notification-preference"
                  className={`${
                    pathname === "/vendor/settings/notification-preference"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Notification Preference
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/vendor/support"
            className={`${
              pathname === "/vendor/support"
                ? "bg-orange-50 text-[#F28C0D]"
                : "text-gray-600 hover:bg-orange-50 hover:text-[#F28C0D]"
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Vendor Support
          </Link>

          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => toggleSection("shop")}
              className={`${
                pathname.startsWith("/vendor/shop")
                  ? "bg-orange-50 text-[#F28C0D]"
                  : "text-[#F28C0D] hover:bg-orange-50"
              } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors`}
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Shop Management
              <svg
                className={`ml-auto h-4 w-4 transform transition-transform ${
                  expandedSections.includes("shop") ? "rotate-90" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {expandedSections.includes("shop") && (
              <div className="ml-6 mt-2 space-y-1">
                <Link
                  href="/vendor/shop/profile"
                  className={`${
                    pathname === "/vendor/shop/profile"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Shop Profile & Branding
                </Link>
                <Link
                  href="/vendor/shop/promotions"
                  className={`${
                    pathname === "/vendor/shop/promotions"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Promotions & Discounts
                </Link>
                <Link
                  href="/vendor/shop/policies"
                  className={`${
                    pathname === "/vendor/shop/policies"
                      ? "text-[#F28C0D] bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } block px-3 py-1 text-sm rounded-md transition-colors`}
                >
                  Store Policies
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* <div className="absolute bottom-4 left-4">
        <button
          onClick={logout}
          className="text-[#8B4513] flex items-center text-sm font-medium hover:text-[#F28C0D]"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log out
        </button>
      </div> */}
    </div>
  );
}
