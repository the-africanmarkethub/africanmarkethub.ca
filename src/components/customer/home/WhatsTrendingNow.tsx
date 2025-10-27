import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/customer/product.types";
import { useTrendingProducts } from "@/hooks/customer/useTrendingProducts";
import WishlistButton from "../WishlistButton";
import { NoResults } from "@/components/ui/no-results";
import QuickViewModal from "./QuickViewModal";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function TrendingProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
}) {
  // Calculate display price - use first variation price if available, otherwise use product sales_price
  const displayPrice =
    product.variations && product.variations.length > 0
      ? product.variations[0].price
      : product.sales_price;

  // Ensure displayPrice is a number and format it
  const formatPrice = (price: string | number): string => {
    const numPrice =
      typeof price === "number" ? price : parseFloat(price || "0");
    return numPrice.toFixed(2);
  };

  const formattedPrice = formatPrice(displayPrice);

  return (
    <div className="relative overflow-hidden group mx-2">
      <div
        className="relative bg-gray-100 overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "400px",
          borderRadius: "24px",
        }}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
          priority={product.id === 1}
        />

        {/* Top-right icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
          <WishlistButton
            productId={product.id}
            size="sm"
            variant="floating"
            className="!relative !top-0 !right-0 bg-white/90 backdrop-blur-sm hover:bg-white"
          />
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-6 px-5">
          <div className="flex items-end justify-between mb-3">
            <h3 className="text-white font-medium text-lg leading-tight">
              {product.title}
            </h3>
            <span className="text-white font-bold text-lg ml-2">
              {formattedPrice} CAD
            </span>
          </div>

          {/* Quick view button */}
          <button
            onClick={() => onQuickView(product)}
            className="bg-white/95 backdrop-blur text-gray-800 px-4 py-2 rounded-full flex items-center justify-center gap-2 text-sm font-medium w-full hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            Quick view
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendingProductContent() {
  const { data: trending, isLoading, error } = useTrendingProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading trending products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <NoResults
        title="Could not load trending products"
        message="There was an issue fetching trending products. Please try again later."
        icon="🚨"
      />
    );
  }

  if (!trending || trending.length === 0) {
    return (
      <NoResults
        title="No Trending Products"
        message="There are currently no products trending. Please check back later."
        icon="✨"
      />
    );
  }

  return (
    <>
      <Carousel
        showDots={false}
        autoPlay
        autoPlaySpeed={5000}
        infinite
        responsive={responsive}
        transitionDuration={1000}
        arrows={true}
        swipeable={true}
        draggable={true}
      >
        {trending.map((product) => (
          <TrendingProductCard
            key={product.id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
      </Carousel>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default function WhatsTrendingNow() {
  return (
    <section className="my-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What&apos;s Trending Now
        </h2>
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="relative">
        <TrendingProductContent />
      </div>
    </section>
  );
}
