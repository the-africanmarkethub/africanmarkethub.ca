"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { useShops } from "@/hooks/customer/useShops";
import { Shop } from "@/types/customer/shop.types";

interface ShopDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;
  const { data, isLoading, error } = useShops();

  const shop = data?.shops?.data?.find((s: Shop) => s.slug === slug);

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

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Shop not found
            </h2>
            <p className="text-gray-600 mb-6">
              The shop you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/shops"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Shops
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-20">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/shops"
            className="inline-flex items-center text-primary hover:text-primary transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Shops
          </Link>
        </div>

        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Banner */}
          <div className="relative h-64 w-full">
            <Image
              src={shop.banner}
              alt={`${shop.name} banner`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Shop Logo */}
            <div className="absolute bottom-4 left-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={shop.logo}
                  alt={`${shop.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Shop Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {shop.name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {shop.address}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {shop.category.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    shop.type === "products"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {shop.type === "products" ? "Products" : "Services"}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    shop.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {shop.status}
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {shop.description}
            </p>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Shop Owner
              </h3>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={shop.vendor.profile_photo}
                    alt={`${shop.vendor.name} profile`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {shop.vendor.name} {shop.vendor.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{shop.vendor.email}</p>
                  <p className="text-sm text-gray-500">
                    {shop.vendor.city}, {shop.vendor.state},{" "}
                    {shop.vendor.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View Products
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Contact Shop
          </button>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location Details
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">State:</span> {shop.state.name}
              </p>
              <p>
                <span className="font-medium">City:</span> {shop.city.name}
              </p>
              <p>
                <span className="font-medium">Address:</span> {shop.address}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Shop Details
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {shop.category.name}
              </p>
              <p>
                <span className="font-medium">Type:</span> {shop.type}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(shop.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
