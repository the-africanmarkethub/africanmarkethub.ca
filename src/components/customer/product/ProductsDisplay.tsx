import React from "react";
import ItemCard from "../home/ItemCard";
import { Product } from "@/types/customer/product.types";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductsDisplayProps {
  title: string;
  data: Product[] | { data: Product[] };
  hasButton: boolean;
  fontSize: string;
  showViewMore?: boolean;
  viewMoreLink?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

function ProductsDisplay({
  title,
  data,
  hasButton,
  fontSize,
  showViewMore,
  viewMoreLink,
  pagination,
}: ProductsDisplayProps) {
  // Extract products array from data (handle both array and pagination object)
  const productsArray = Array.isArray(data) ? data : data?.data || [];

  // For responsive behavior, show all products and let CSS handle the responsive layout
  // We'll use Tailwind classes to hide excess items on mobile
  const displayData = showViewMore ? productsArray.slice(0, 16) : productsArray;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h1 className={`text-xl md:text-2xl lg:${fontSize} font-semibold`}>
          {title}
        </h1>
        {showViewMore !== false && (
          showViewMore && viewMoreLink ? (
            <Link href={viewMoreLink}>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-[#F3EDE7] bg-white text-primary hover:bg-gray-50 transition-colors">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </Link>
          ) : (
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-[#F3EDE7] bg-white text-primary cursor-default">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
        {displayData && Array.isArray(displayData) && displayData.length > 0 ? (
          displayData.map((product, index) => (
            <div
              key={product.id}
              className={showViewMore ? `${
                // Hide items beyond 8 on mobile, beyond 16 on desktop
                index >= 8 ? 'hidden md:block' : ''
              } ${index >= 16 ? 'hidden' : ''}`.trim() : ''}
            >
              <ItemCard
                hasButton={hasButton}
                item={product}
                displayRegular={false}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-8 text-gray-500">
            No products to display
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => pagination.onPageChange(page)}
                  className={`px-3 py-2 rounded-lg border ${
                    page === pagination.currentPage
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsDisplay;
