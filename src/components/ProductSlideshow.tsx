"use client";

import { useState } from "react";

interface OrderItem {
  id: number;
  product: {
    id: number;
    title: string;
    images: string[];
  };
  quantity: number;
}

interface ProductSlideshowProps {
  orderItems: OrderItem[];
  showProductNames?: boolean;
}

export default function ProductSlideshow({ orderItems, showProductNames = false }: ProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!orderItems || orderItems.length === 0) {
    return <div className="text-gray-500">No items</div>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === orderItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? orderItems.length - 1 : prevIndex - 1
    );
  };

  const currentItem = orderItems[currentIndex];
  const currentImage = currentItem.product?.images?.[0] || "/placeholder.jpg";

  // Get unique product names for display
  const productNames = orderItems.map(item => item.product?.title || "Product");
  const displayNames = productNames.length > 2 
    ? `${productNames[0]}, ${productNames[1]}... +${productNames.length - 2}`
    : productNames.join(", ");

  return (
    <div className="flex items-center space-x-3">
      {/* Product Image Container */}
      <div className="relative w-10 h-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
        {/* Product Image */}
        {currentImage && currentImage !== "/placeholder.jpg" ? (
          <img
            src={currentImage}
            alt={currentItem.product?.title || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Navigation arrows (only show if more than 1 item) */}
        {orderItems.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-sm w-4 h-4 flex items-center justify-center hover:bg-gray-50 transition-colors opacity-0 hover:opacity-100"
            >
              <svg className="w-2 h-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-sm w-4 h-4 flex items-center justify-center hover:bg-gray-50 transition-colors opacity-0 hover:opacity-100"
            >
              <svg className="w-2 h-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Item count badge */}
        {orderItems.length > 1 && (
          <div className="absolute -top-1 -right-1 bg-[#F28C0D] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {orderItems.length}
          </div>
        )}
      </div>
      
      {/* Product Names (if enabled) */}
      {showProductNames && (
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 truncate" title={productNames.join(", ")}>
            {displayNames}
          </p>
          <p className="text-xs text-gray-500">
            {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}