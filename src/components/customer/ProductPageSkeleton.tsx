import MaxWidthWrapper from "./MaxWidthWrapper";

export default function ProductPageSkeleton() {
  return (
    <MaxWidthWrapper className="mt-12 md:mt-[26px] mb-10 md:mb-20">
      {/* Breadcrumb skeleton */}
      <div className="flex text-xs md:text-sm gap-1 items-center mb-4">
        <div className="h-3 md:h-4 w-12 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 md:h-4 w-3 md:w-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 md:h-4 w-16 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 md:h-4 w-3 md:w-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 md:h-4 w-24 bg-gray-200 animate-pulse rounded" />
      </div>

      <div className="space-y-8 w-full md:space-y-20">
        <div className="flex flex-col md:flex-row mt-4 md:mt-[46px] gap-4 w-full">
          {/* Image Gallery Skeleton */}
          <div className="relative w-full md:w-[450px] aspect-[327/270] md:aspect-[450/642] md:h-[642px]">
            {/* Main Image Skeleton */}
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-[16px] md:rounded-[32px]" />
            
            {/* Thumbnails Skeleton */}
            <div className="absolute left-2 md:left-4 top-2 md:top-4 flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 animate-pulse rounded-lg md:rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-4 md:space-y-8 w-full md:w-[515px]">
            {/* Title and Badge */}
            <div>
              <div className="flex gap-4 items-center mb-2">
                <div className="h-4 md:h-7 w-48 md:w-80 bg-gray-200 animate-pulse rounded" />
                <div className="h-6 md:h-8 w-16 bg-gray-200 animate-pulse rounded-full" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-6">
                <div className="flex gap-0.5 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 md:h-6 w-4 md:w-6 bg-gray-200 animate-pulse rounded" />
                  ))}
                  <div className="h-3 md:h-4 w-8 bg-gray-200 animate-pulse rounded ml-1" />
                </div>
                <div className="h-3 md:h-4 w-32 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="h-3 md:h-4 w-8 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="flex gap-2 md:gap-4 items-center">
                <div className="h-6 md:h-8 w-20 md:w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-5 md:h-6 w-16 md:w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>

            {/* Description (desktop only) */}
            <div className="md:block hidden space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="h-4 w-8 bg-gray-200 animate-pulse rounded" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-8 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="flex flex-row items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-[34px] md:h-[34px] bg-gray-200 animate-pulse rounded-full" />
                <div className="px-3 md:px-4 h-5 w-8 bg-gray-200 animate-pulse rounded mx-2" />
                <div className="w-8 h-8 md:w-[34px] md:h-[34px] bg-gray-200 animate-pulse rounded-full" />
              </div>

              {/* Add to Cart Button */}
              <div className="w-[139px] h-7 md:w-[264px] md:h-[54px] bg-gray-200 animate-pulse rounded-full md:rounded-[32px]" />

              {/* Wishlist Button */}
              <div className="w-7 h-7 md:w-[84px] md:h-[54px] bg-gray-200 animate-pulse rounded-full" />
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-gray-200 animate-pulse" />

            {/* SKU and Category */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          {/* Sidebar Skeleton (desktop only) */}
          <div className="hidden md:block w-full">
            <div className="border-[3px] border-[#F8F8F8] rounded-2xl p-4 space-y-4">
              {/* Delivery Section */}
              <div className="space-y-3">
                <div className="h-5 w-48 bg-gray-200 animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-200" />

              {/* Return Policy */}
              <div className="space-y-3">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-200" />

              {/* Seller Information */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-36 bg-gray-200 animate-pulse rounded" />
                  <div className="w-[61px] h-[22px] bg-gray-200 animate-pulse rounded-full" />
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-4/5 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Description Tabs Skeleton */}
        <div className="md:hidden space-y-4">
          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-t" />
              <div className="flex-1 h-10 bg-gray-100 animate-pulse rounded-t" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* Tab Content Skeleton (desktop) */}
        <div className="hidden md:block space-y-4">
          <div className="flex border-b border-gray-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-12 bg-gray-200 animate-pulse rounded-t mr-1" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            ))}
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* Product Sections Skeleton */}
        <div className="space-y-8">
          {/* Frequently bought together */}
          <div className="space-y-4">
            <div className="h-7 md:h-8 w-64 bg-gray-200 animate-pulse rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Customer views skeleton */}
          <div className="space-y-4">
            <div className="h-7 md:h-8 w-80 bg-gray-200 animate-pulse rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}