"use client";

import React from "react";
import { useState, useMemo } from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { useProducts } from "@/hooks/customer/useProducts";
import { Product } from "@/types/customer/product.types";
import ItemCard from "@/components/customer/home/ItemCard";

// Using shared ItemCard (Product Card)

export default function ServicesPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = useProducts(
    "services",
    String(currentPage)
  );

  // Adjust to the actual response shape: { status, data: Product[], total, offset, limit }
  const listResponse =
    (data as { data?: Product[]; total?: number; limit?: number }) || {};
  const services: Product[] = listResponse.data || [];
  const totalItems =
    typeof listResponse.total === "number"
      ? listResponse.total
      : services.length;
  const perPage =
    typeof listResponse.limit === "number" ? listResponse.limit : 20;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / perPage)),
    [totalItems, perPage]
  );

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
              Unable to load services
            </h2>
            <p className="text-gray-600">
              There was an error loading the services. Please try again later.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
          <p className="text-lg text-gray-600">
            Discover professional services from our community of experts
          </p>
        </div>

        {services.length === 0 ? (
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">
              There are currently no services available.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {services.length} of {totalItems} services
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
              {services.map((service: Product) => (
                <ItemCard
                  key={service.id}
                  item={service}
                  hasButton={true}
                  displayRegular={false}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.max(0, currentPage - 3) + 5
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-md border ${
                          page === currentPage
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
