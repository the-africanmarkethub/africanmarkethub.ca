"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { useShops } from "@/hooks/customer/useShops";
import { Shop } from "@/types/customer/shop.types";

const ShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <Link href={`/customer/shops/${shop.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
        {/* Shop Banner */}
        <div className="relative h-48 w-full">
          <Image
            src={shop.banner}
            alt={`${shop.name} banner`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        {/* Shop Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={shop.logo}
                  alt={`${shop.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {shop.name}
                </h3>
                <p className="text-sm text-gray-500">{shop.category.name}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                shop.type === "products"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {shop.type === "products" ? "Products" : "Services"}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {shop.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{shop.address}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>
                {shop.vendor.name} {shop.vendor.last_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ShopsPage() {
  const { data, isLoading, error } = useShops();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Unable to load shops
            </h2>
            <p className="text-gray-600">
              There was an error loading the shops. Please try again later.
            </p>
            <p className="text-sm text-red-600 mt-2">
              Error: {error?.message || "Unknown error"}
            </p>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  const shops = data?.shops?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shops</h1>
          <p className="text-lg text-gray-600">
            Discover amazing shops and services from our community
          </p>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No shops found
            </h3>
            <p className="text-gray-600">
              There are currently no shops available.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {shops.length} of {data?.shops?.total || 0} shops
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
