"use client";
import ItemCard from "@/components/customer/home/ItemCard";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import ProductFilterSidebar from "@/components/customer/product/ProductFilterSidebar";
import { NoResults } from "@/components/ui/no-results";
import { useCategoryProducts } from "@/hooks/customer/useCategoryProducts";
import { Product } from "@/types/customer/product.types";
import { ChevronRight, Filter, ChevronDown, Grid3X3 } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const pathname = usePathname();
  const categoryId = decodeURIComponent(pathname.split("/")[3]);

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useCategoryProducts(categoryId);

  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name");

  if (isProductLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading category products...</div>
      </div>
    );
  }

  if (productError) {
    return (
      <MaxWidthWrapper className="my-8">
        <NoResults
          title="Could Not Load Products"
          message="There was an error loading products for this category. Please try again later."
          icon="🚨"
          showGoBack={true}
        />
      </MaxWidthWrapper>
    );
  }

  const products = productData?.products?.data || [];

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="relative ">
        <Image
          src="/img/Banner.svg"
          alt=""
          width={1440}
          height={177}
          className="w-full h-[120px] md:h-[177px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center text-white px-4 md:px-0 md:top-[38px] md:left-[81px] md:space-y-[22px]">
          <h1 className="text-base md:text-5xl font-semibold tracking-tight">
            {categoryName || "Category"}
          </h1>

          <div className="flex text-[6px] md:text-sm font-normal md:gap-1 items-center mt-2 md:mt-0">
            <p>Home</p>
            <ChevronRight
              width={16}
              height={16}
              className="md:w-6 w-2 h-2 md:h-6"
            />
            <p>Category</p>
            <ChevronRight
              width={16}
              height={16}
              className="md:w-6 w-2 h-2 md:h-6"
            />
            <p>{categoryName}</p>
          </div>
        </div>
      </div>

      <MaxWidthWrapper className="my-4 md:my-8 w-full">
        {/* Mobile Filter and Sort Section */}
        <div className="md:hidden mb-4">
          <p className="text-xs text-gray-600 mb-3">
            Showing 1-8 of {products.length} Results
          </p>
          <div className="flex items-center rounded-lg p-1">
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs">
              <Filter className="w-3 h-3" />
              <span>Filters</span>
            </button>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs">
              <span>Sort by</span>
            </button>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs">
              <span>Latest</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="p-1.5 ml-auto">
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-8 w-full items-start">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <ProductFilterSidebar />
          </div>

          <div className="flex-1">
            {products.length > 0 ? (
              <>
                {/* Desktop Results Count */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing 1-8 of {products.length} Results
                  </p>
                  <div className="flex items-center gap-4">
                    {/* Sort and view options would go here */}
                  </div>
                </div>
                {/* Product Grid - 2 columns on mobile, 2-3 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {products.map((product: Product) => (
                    <ItemCard
                      item={product}
                      hasButton={true}
                      categoryName={`${categoryName}`}
                      displayRegular={false}
                      key={product.id}
                    />
                  ))}
                </div>
                {/* Pagination would go here */}
              </>
            ) : (
              <div className="col-span-full">
                <NoResults
                  title={productData?.products?.message || "No products found"}
                  message={`We couldn't find any products in the "${categoryName}" category.`}
                  icon="📦"
                  showGoBack={true}
                  showBrowseAll={true}
                  goBackText="Go Back"
                  browseAllText="Browse All Categories"
                />
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Page;
