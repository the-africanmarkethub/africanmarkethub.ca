"use client";

import { ItemCard } from "@/components/ItemCard";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import Link from "next/link";

export default function RecommendedPage() {
  const { data: recommendedProducts, isLoading, error } = useRecommendedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recommended for You
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }, (_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to load products</h2>
            <p className="text-gray-500 text-center mb-6">
              We&apos;re having trouble loading the recommended products. Please try again later.
            </p>
            <Link href="/">
              <button className="bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        ) : recommendedProducts?.data?.data && recommendedProducts.data.data.length > 0 ? (
          // Products grid
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {recommendedProducts.data.data.length} of {recommendedProducts.data.total} products
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {recommendedProducts.data.data.map((product: any) => {
                const hasDiscount = parseFloat(product.regular_price) > parseFloat(product.sales_price);
                const discountPercentage = hasDiscount 
                  ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sales_price)) / parseFloat(product.regular_price)) * 100)
                  : 0;
                
                return (
                  <ItemCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    slug={product.slug}
                    price={`$${parseFloat(product.sales_price).toFixed(2)} CAD`}
                    originalPrice={hasDiscount ? `$${parseFloat(product.regular_price).toFixed(2)} CAD` : undefined}
                    rating={product.average_rating || 5}
                    image={product.images[0] || "/icon/auth.svg"}
                    discount={hasDiscount ? `${discountPercentage}% off` : undefined}
                    type={product.type === "services" ? "service" : "product"}
                  />
                );
              })}
            </div>

            {/* Pagination could be added here if needed */}
            {recommendedProducts.data.total > recommendedProducts.data.per_page && (
              <div className="mt-12 text-center">
                <p className="text-gray-500">
                  Load more functionality can be implemented here
                </p>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500 text-center mb-6">
              We don&apos;t have any recommended products to show right now.
            </p>
            <Link href="/">
              <button className="bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors">
                Explore Marketplace
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}