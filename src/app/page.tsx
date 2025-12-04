"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/ItemCard";
import { TodaysDeals } from "@/components/TodaysDeals";
import { FeaturedProductsCarousel } from "@/components/FeaturedProductsCarousel";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { useProductCategories } from "@/hooks/useCategories";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const {
    data: recommendedProducts,
    isLoading,
    error,
  } = useRecommendedProducts();
  const { data: categoriesResponse } = useProductCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Show splash for 2 seconds

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Hide splash after fade out

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);


  const handleSkipSplash = () => {
    setFadeOut(true);
    setTimeout(() => setShowSplash(false), 300);
  };


  // Marketplace Landing Page
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Splash Screen Overlay */}
      {showSplash && (
        <div
          className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleSkipSplash}
        >
          <div className="text-center">
            <div className="animate-bounce">
              <Image
                src="/icon/logo.svg"
                alt="African Market Hub"
                width={400}
                height={134}
                className="mx-auto"
              />
            </div>
            <div className="mt-8">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                style={{ borderColor: "#F28C0D" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section
        className="relative py-4 md:py-8"
        style={{ backgroundColor: "#FFFBED" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center min-h-[400px] md:min-h-[849px]">
            {/* Left side - Hero Image */}
            <div className="hidden md:block rounded-2xl overflow-hidden mx-auto w-full max-w-[500px] md:max-w-none">
              <Image
                src="/icon/auth.svg"
                alt="African Market Hub"
                width={500}
                height={300}
                className="object-contain w-full h-[300px] md:h-[849px]"
                priority
              />
            </div>

            <div className="block md:hidden relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mx-auto w-full max-w-[500px] md:max-w-none">
              <Image
                src="/icon/auth.svg"
                alt="African Market Hub"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right side - Content */}
            <div className="space-y-4 md:space-y-8">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to Africa&apos;s{" "}
                <span className="text-[#F28C0D]">leading online</span>{" "}
                marketplace.
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Discover a variety of authentic African products, from fashion
                and crafts to fresh produce and electronics.
              </p>
              <div className="flex  gap-3 md:gap-4">
                <Link href="/auth/login">
                  <button
                    className="text-white px-8 text-sm md:text-base py-3 rounded-full font-normal md:font-semibold transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#F28C0D" }}
                  >
                    Explore market place
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button
                    className="border text-sm md:text-base text-gray-700 px-8 py-3 rounded-full font-normal md:font-semibold transition-colors hover:opacity-80"
                    style={{ borderColor: "#F28C0D" }}
                  >
                    Get started
                  </button>
                </Link>
              </div>

              {/* Featured Products Preview - Carousel */}
              <FeaturedProductsCarousel 
                products={recommendedProducts?.data?.data}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Product Category
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {categoriesResponse?.categories
              ?.filter((category) => !category.parent_id)
              ?.slice(0, 5)
              ?.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/products/${category.id}`}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    index === 0
                      ? "text-white"
                      : "text-gray-600 border border-gray-300 hover:border-gray-400"
                  }`}
                  style={index === 0 ? { backgroundColor: "#F28C0D" } : {}}
                >
                  {category.name}
                </Link>
              ))}
          </div>

          {/* Category Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesResponse?.categories
              ?.filter((category) => !category.parent_id)
              ?.slice(0, 8)
              ?.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/products/${category.id}`}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                          />
                        </svg>
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quick view button */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>Quick view</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-white min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFF4E6] rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Viva!</h3>
              <p className="text-gray-600 mb-6">Your Fashion Choice</p>
              <button className="bg-[#F28C0D] text-white px-6 py-2 rounded-full">
                Shop Now
              </button>
            </div>
            <div className="bg-blue-100 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Electronics</h3>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
                Shop Now
              </button>
            </div>
            <div className="bg-green-100 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Food & Drinks</h3>
              <button className="bg-green-500 text-white px-6 py-2 rounded-full">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      <section className="py-16 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <Link href="/recommended">
              <button className="text-[#F28C0D] hover:opacity-90 transition-colors flex items-center space-x-2">
                <span>See all</span>
                <svg
                  className="w-5 h-5"
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
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">
                  Unable to load recommended products. Please try again later.
                </p>
              </div>
            ) : (
              // Actual data - limit to 8 products
              recommendedProducts?.data?.data
                ?.slice(0, 8)
                ?.map((product: any) => {
                  const hasDiscount =
                    parseFloat(product.regular_price) >
                    parseFloat(product.sales_price);
                  const discountPercentage = hasDiscount
                    ? Math.round(
                        ((parseFloat(product.regular_price) -
                          parseFloat(product.sales_price)) /
                          parseFloat(product.regular_price)) *
                          100
                      )
                    : 0;

                  return (
                    <ItemCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      slug={product.slug}
                      price={`$${parseFloat(product.sales_price).toFixed(
                        2
                      )} CAD`}
                      originalPrice={
                        hasDiscount
                          ? `$${parseFloat(product.regular_price).toFixed(
                              2
                            )} CAD`
                          : undefined
                      }
                      rating={product.average_rating || 5}
                      image={product.images[0] || "/icon/auth.svg"}
                      discount={
                        hasDiscount ? `${discountPercentage}% off` : undefined
                      }
                      type={product.type === "services" ? "service" : "product"}
                    />
                  );
                })
            )}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <TodaysDeals />
    </div>
  );
}
