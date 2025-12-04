"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useProductSearch } from "@/hooks/useProductSearch";
import { ItemCard } from "@/components/ItemCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: searchResults, isLoading, error } = useProductSearch({
    query,
    page: 1,
    per_page: 20,
  });

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please enter a search query</p>
      </div>
    );
  }

  if (isLoading) {
    return (
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
          <span className="text-gray-600 text-lg">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading search results</p>
        <p className="text-gray-600 text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  const products = searchResults?.data?.data || [];
  const total = searchResults?.data?.total || 0;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Search Results for &quot;{query}&quot;
          </h2>
          <p className="text-gray-600 mt-1">
            {total} {total === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {products.map((product) => (
            <ItemCard
              key={product.id}
              id={product.id.toString()}
              title={product.title}
              image={product.images[0]}
              price={product.sales_price}
              originalPrice={product.regular_price}
              rating={product.average_rating}
              slug={product.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4">
            <svg
              className="w-full h-full text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <span className="text-gray-600">Loading...</span>
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}