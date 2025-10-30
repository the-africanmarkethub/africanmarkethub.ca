import React from "react";
import ProductsDisplay from "@/components/customer/product/ProductsDisplay";
import { useRecommendedProducts } from "@/hooks/customer/useRecommendedProducts";

export default function RecommendedProducts() {
  const { data: recommendedProducts, isLoading: isProductLoading, error: productError } = useRecommendedProducts();

  return (
    <section>
      {isProductLoading ? (
        <>
          <h2 className="lg:text-[42px] font-semibold mb-6">
            Recommended for You
          </h2>
          <div className="text-center py-8">
            <div className="text-lg">Loading recommended products...</div>
          </div>
        </>
      ) : productError ? (
        <>
          <h2 className="text-[42px] font-semibold mb-6">
            Recommended for You
          </h2>
          <div className="text-center py-8">
            <div className="text-red-500">
              Error loading recommended products: {productError.message}
            </div>
          </div>
        </>
      ) : recommendedProducts &&
        recommendedProducts.data &&
        recommendedProducts.data.data &&
        recommendedProducts.data.data.length > 0 ? (
        <ProductsDisplay
          title="Recommended for You"
          fontSize="text-[42px]"
          data={recommendedProducts.data.data}
          hasButton={false}
          showViewMore={true}
          viewMoreLink="/customer/recommended"
        />
      ) : (
        <>
          <h2 className="text-[42px] font-semibold mb-6">
            Recommended for You
          </h2>
          <div className="text-center py-8">
            <div className="text-gray-500">
              No recommended products found
            </div>
          </div>
        </>
      )}
    </section>
  );
}