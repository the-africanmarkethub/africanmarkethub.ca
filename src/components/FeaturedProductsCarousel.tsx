"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface FeaturedProductsCarouselProps {
  products?: Product[];
  isLoading: boolean;
}

export const FeaturedProductsCarousel = ({
  products,
  isLoading,
}: FeaturedProductsCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll carousel effect
  useEffect(() => {
    if (!products || isLoading) return;

    const maxSlides = Math.max(0, (products.length || 8) - 3);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (maxSlides + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [products, isLoading]);

  const displayProducts = products?.slice(0, 20) || [];

  return (
    <div className="mt-6 md:mt-12">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / 3)}%)`,
          }}
        >
          {isLoading
            ? // Loading skeleton for featured products
              Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="flex-none w-1/3 px-1">
                  <div className="bg-gray-100 rounded-lg p-2 md:p-4 text-center animate-pulse">
                    <div className="h-12 md:h-20 rounded-lg mb-2 bg-gray-200"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/2 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  </div>
                </div>
              ))
            : displayProducts.map((product) => {
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
                  <div key={product.id} className="flex-none w-1/3 px-1">
                    <Link href={`/products/${product.slug}`}>
                      <div className="bg-gray-100 rounded-lg p-2 md:p-4 text-center hover:bg-gray-200 transition-colors cursor-pointer">
                        <div className="h-12 md:h-20 rounded-lg mb-2 relative overflow-hidden bg-gray-200">
                          <Image
                            src={product.images[0] || "/icon/auth.svg"}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Name */}
                        <p className="text-xs md:text-sm font-medium text-gray-800 mb-1 truncate px-1">
                          {product.title}
                        </p>

                        {hasDiscount && (
                          <p className="text-xs text-red-500">
                            {discountPercentage}% discount!
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-gray-400 font-semibold">
                          ${parseFloat(product.sales_price).toFixed(2)} CAD
                        </p>
                        {hasDiscount && (
                          <p className="text-xs text-gray-400 line-through">
                            ${parseFloat(product.regular_price).toFixed(2)} CAD
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};
