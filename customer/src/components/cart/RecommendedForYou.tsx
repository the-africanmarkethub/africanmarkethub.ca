"use client";

import ProductsDisplay from "@/components/product/ProductsDisplay";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";

export default function RecommendedForYou() {
  const { data: recommendedProducts, isFetching: isLoading } =
    useRecommendedProducts();

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="mt-16">
      <ProductsDisplay
        title="Recommended for You"
        data={recommendedProducts}
        hasButton={true}
        fontSize="text-2xl"
      />
    </div>
  );
}
