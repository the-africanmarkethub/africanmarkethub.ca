"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = parseInt(params.id as string);
  const type = params.type as "products" | "services";

  const [filters, setFilters] = useState({
    min_price: searchParams.get("min_price") ? parseInt(searchParams.get("min_price")!) : undefined,
    max_price: searchParams.get("max_price") ? parseInt(searchParams.get("max_price")!) : undefined,
    category_id: searchParams.get("category_id") ? parseInt(searchParams.get("category_id")!) : undefined,
    size_id: searchParams.get("size_id") ? parseInt(searchParams.get("size_id")!) : undefined,
    rating: searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : undefined,
    availability: searchParams.get("availability") || undefined,
    location: searchParams.get("location") || undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: filters.min_price || 0, max: filters.max_price || 1000 });
  const [sortBy, setSortBy] = useState("latest");

  const { data: categoryResponse, isLoading, error } = useCategoryProducts(categoryId, type, filters);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      min_price: undefined,
      max_price: undefined,
      category_id: undefined,
      size_id: undefined,
      rating: undefined,
      availability: undefined,
      location: undefined,
      page: 1,
    });
    setPriceRange({ min: 0, max: 1000 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {type}...</p>
        </div>
      </div>
    );
  }

  // Handle the case when API returns error status for no products
  const hasNoProducts = categoryResponse?.status === "error" && categoryResponse?.message === "No products found";
  
  if (error || (!categoryResponse && !hasNoProducts)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Category not found</h3>
          <p className="text-gray-600">This category may not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Handle the actual API response structure
  const category = categoryResponse?.category || { 
    name: type === "products" ? "Products" : "Services", 
    id: categoryId 
  };
  
  // Get products or services based on the type from the nested response
  const responseData = categoryResponse?.data;
  const products = responseData?.data || [];
  const pagination = responseData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white py-16 overflow-hidden">
        <Image
          src="/icon/banner.svg"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{category.name}</h1>
          <div className="flex items-center space-x-2 mt-2 text-orange-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href={`/${type}`} className="hover:text-white transition-colors capitalize">
              {type}
            </Link>
            <span>›</span>
            <span>{category.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-[#F28C0D] hover:text-orange-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min || ""}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max || ""}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleFilterChange({ min_price: priceRange.min, max_price: priceRange.max })}
                    className="w-full bg-[#F28C0D] hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Apply Price Filter
                  </button>
                </div>
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category_id}
                      onChange={() => handleFilterChange({ category_id: undefined })}
                      className="w-4 h-4 text-[#F28C0D] border-gray-300 focus:ring-[#F28C0D]"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  {/* Add more category options based on API */}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange({ rating })}
                        className="w-4 h-4 text-[#F28C0D] border-gray-300 focus:ring-[#F28C0D]"
                      />
                      <div className="ml-2 flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">{rating}.0</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === "in_stock"}
                      onChange={() => handleFilterChange({ availability: "in_stock" })}
                      className="w-4 h-4 text-[#F28C0D] border-gray-300 focus:ring-[#F28C0D]"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === "fast_delivery"}
                      onChange={() => handleFilterChange({ availability: "fast_delivery" })}
                      className="w-4 h-4 text-[#F28C0D] border-gray-300 focus:ring-[#F28C0D]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Fast Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filters</span>
                  </button>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Showing {pagination?.from || 0}-{pagination?.to || 0} of {pagination?.total || 0} Results</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none"
                    >
                      <option value="latest">Latest</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Categories:</span>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none">
                      <option>Categories</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} found</h3>
                <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const hasDiscount = parseFloat(product.regular_price) > parseFloat(product.sales_price);
                    const discountPercentage = hasDiscount
                      ? Math.round(
                          ((parseFloat(product.regular_price) - parseFloat(product.sales_price)) /
                            parseFloat(product.regular_price)) * 100
                        )
                      : 0;

                    return (
                      <ItemCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        slug={product.slug}
                        price={`$${parseFloat(product.sales_price).toFixed(2)} CAD`}
                        originalPrice={
                          hasDiscount
                            ? `$${parseFloat(product.regular_price).toFixed(2)} CAD`
                            : undefined
                        }
                        rating={product.average_rating || 5}
                        image={product.images[0] || "/icon/placeholder.svg"}
                        discount={hasDiscount ? `${discountPercentage}% off` : undefined}
                        type={product.type === "services" ? "service" : "product"}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    {pagination.prev_page_url && (
                      <button
                        onClick={() => handleFilterChange({ page: pagination.current_page - 1 })}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleFilterChange({ page: pageNum })}
                          className={`w-8 h-8 rounded-full font-medium ${
                            pageNum === pagination.current_page
                              ? "bg-[#F28C0D] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {pagination.next_page_url && (
                      <button
                        onClick={() => handleFilterChange({ page: pagination.current_page + 1 })}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {pagination && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {pagination.from}-{pagination.to} of {pagination.total} results
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}