"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "./ItemCard";
import Link from "next/link";
import { useDeals } from "@/hooks/useDeals";

export function TodaysDeals() {
  const { data: dealsResponse, isLoading, error } = useDeals();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Find the earliest ending deal for countdown
    const deals = dealsResponse?.data || [];
    if (deals.length === 0) return;

    const nextEndTime = deals
      .map(deal => new Date(deal.end_time).getTime())
      .sort((a, b) => a - b)[0];

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = nextEndTime - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [dealsResponse]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deals...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !dealsResponse?.data || dealsResponse.data.length === 0) {
    return null; // Don't show section if no deals
  }

  const deals = dealsResponse.data.slice(0, 8); // Show max 8 deals

  const getDiscountPercentage = (deal: {
    product: {
      regular_price: string;
      sales_price: string;
    };
  }) => {
    const originalPrice = parseFloat(deal.product.regular_price);
    const salesPrice = parseFloat(deal.product.sales_price);
    
    // Use the actual price difference from the API
    if (originalPrice > salesPrice) {
      return Math.round(((originalPrice - salesPrice) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <section className="py-16 bg-gray-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Countdown */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Today&apos;s Deal</h2>
            <p className="text-gray-600">Limited time offers - don&apos;t miss out!</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center space-x-2 md:space-x-4 mt-6 lg:mt-0">
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-sm p-2 md:p-3 min-w-[50px] md:min-w-[60px]">
                <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.days.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-sm p-2 md:p-3 min-w-[50px] md:min-w-[60px]">
                <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-sm p-2 md:p-3 min-w-[50px] md:min-w-[60px]">
                <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Mins</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-sm p-2 md:p-3 min-w-[50px] md:min-w-[60px]">
                <div className="text-lg md:text-2xl font-bold text-gray-900">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Secs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {deals.map((deal) => {
            const discountPercentage = getDiscountPercentage(deal);

            return (
              <ItemCard
                key={deal.id}
                id={deal.product.id}
                title={deal.product.title}
                slug={deal.product.slug}
                price={`$${parseFloat(deal.product.sales_price).toFixed(2)} CAD`}
                originalPrice={
                  discountPercentage > 0 
                    ? `$${parseFloat(deal.product.regular_price).toFixed(2)} CAD`
                    : undefined
                }
                rating={deal.product.average_rating || 5}
                image={deal.product.images[0] || "/icon/placeholder.svg"}
                discount={discountPercentage > 0 ? `${discountPercentage}% off` : undefined}
                type={deal.product.type === "services" ? "service" : "product"}
              />
            );
          })}
        </div>

        {/* See All Products Link */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-[#F28C0D] hover:text-orange-600 font-medium transition-colors"
          >
            See All Products
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}