"use client";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import ProductsDisplay from "@/components/customer/product/ProductsDisplay";
import { useRecommendedProducts } from "@/hooks/customer/useRecommendedProducts";
import { useState } from "react";

export default function RecommendedProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: recommendedProducts,
    isLoading: isProductLoading,
    error: productError,
  } = useRecommendedProducts({ page: currentPage });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-6 mt-9 sm:mt-0 md:py-8">
      <MaxWidthWrapper>
        {isProductLoading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading recommended products...</div>
          </div>
        ) : productError ? (
          <div className="text-center py-8">
            <div className="text-red-500">
              Error loading recommended products: {productError.message}
            </div>
          </div>
        ) : recommendedProducts &&
          recommendedProducts.data &&
          recommendedProducts.data.data &&
          recommendedProducts.data.data.length > 0 ? (
          <ProductsDisplay
            title="Recommended for You"
            fontSize="text-[32px]"
            data={recommendedProducts.data.data}
            hasButton={false}
            pagination={
              recommendedProducts.data.last_page > 1
                ? {
                    currentPage: recommendedProducts.data.current_page,
                    totalPages: recommendedProducts.data.last_page,
                    totalItems: recommendedProducts.data.total,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No recommended products found</div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
