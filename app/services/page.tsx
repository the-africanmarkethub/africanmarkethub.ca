"use client";

import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/ItemCard";

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: itemsData,
    isLoading,
    error,
  } = useItems({
    type: "services",
    page,
    limit,
  });

  const handleNextPage = () => {
    if (itemsData && page * limit < itemsData.total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="inline-flex items-center">
              <svg
                className="animate-spin h-8 w-8 text-[#F28C0D] mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600 text-lg">Loading services...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium">
              Error loading services
            </p>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  const services = itemsData?.data || [];
  const total = itemsData?.total || 0;
  const currentOffset = itemsData?.offset || 0;
  const showingFrom = currentOffset + 1;
  const showingTo = Math.min(currentOffset + services.length, total);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Services</h1>
          <p className="text-gray-600 mt-2">
            {total > 0
              ? `Showing ${showingFrom} - ${showingTo} of ${total} services`
              : "Browse our available services"}
          </p>
        </div>

        {/* Filters Section (placeholder for future implementation) */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Services Grid */}
          <div className="flex-1">
            {services.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {services.map((service) => (
                    <ItemCard
                      key={service.id}
                      id={service.id.toString()}
                      title={service.title}
                      image={service.images[0]}
                      price={service.sales_price}
                      originalPrice={service.regular_price}
                      rating={service.average_rating}
                      slug={service.slug}
                      isService={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#F28C0D] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No services available
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for new services.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
