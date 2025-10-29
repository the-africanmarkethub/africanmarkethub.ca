"use client";
import AdvertCarousel from "@/components/customer/home/AdvertCarousel";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import ProductsDisplay from "@/components/customer/product/ProductsDisplay";
import SubmitButton from "@/components/customer/SubmitButton";
import { useRecommendedProducts } from "@/hooks/customer/useRecommendedProducts";
import Link from "next/link";
import PopularProductCategory from "@/components/customer/home/PopularProductCategory";
import ShopByCategory from "@/components/customer/home/ShopByCategory";
import PopularServiceCategory from "@/components/customer/home/PopularServiceCategory";
import TodaysDeal from "@/components/customer/home/TodaysDeal";
import WhatsTrendingNow from "@/components/customer/home/WhatsTrendingNow";
import CustomerTestimonials from "@/components/customer/home/CustomerTestimonials";

export default function Home() {
  const {
    data: recommendedProducts,
    isLoading: isProductLoading,
    error: productError,
  } = useRecommendedProducts({ page: 1 });

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#FFFBED] mb-6 md:mb-[43px]">
        {/* Mobile Layout - Carousel full width, content below */}
        <div className="md:hidden">
          <div className="w-full">
            <AdvertCarousel />
          </div>
          <div className="px-3 pt-4 pb-6 space-y-4 text-left">
            <div className="space-y-2 text-[#292929]">
              <h1 className="text-xl font-semibold leading-tight">
                Welcome to Africa&apos;s leading online marketplace.
              </h1>
              <p className="text-sm leading-relaxed font-normal text-gray-600">
                Discover a variety of authentic African products, from fashion and crafts to fresh produce and electronics.
              </p>
            </div>
            <div className="flex gap-2">
              <SubmitButton className="flex-1 text-sm rounded-[39px] h-[44px] font-medium">
                Explore Market Place
              </SubmitButton>
              <Link href="/sign-up" className="flex-1">
                <SubmitButton className="w-full bg-[#FFFFFF] text-[#0D0C0D] hover:bg-[#FFFFFF] border border-[#9C5432] rounded-[39px] h-[44px] text-sm font-medium">
                  Sign up/Login
                </SubmitButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden md:block py-11 px-8 lg:pl-20">
          <MaxWidthWrapper className="flex gap-8 flex-row items-start">
            <AdvertCarousel />
            <div className="space-y-6 w-full md:w-[624px]">
              <div className="space-y-6 text-[#292929]">
                <h1 className="text-[42px] lg:text-[54px] font-semibold leading-[63px]">
                  Welcome to Africa&apos;s leading online marketplace.
                </h1>
                <p className="text-lg leading-[27px] font-normal">
                  Discover a variety of authentic African products, from fashion
                  and crafts to fresh produce and electronics.
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <SubmitButton className="w-[250px] text-sm rounded-[39px] h-14">
                  Explore market place
                </SubmitButton>
                <Link href="/sign-up">
                  <SubmitButton className="w-[153px] bg-[#FFFFFF] text-[#0D0C0D] hover:bg-[#FFFFFF] border border-[#9C5432] rounded-[39px] h-14">
                    Get started
                  </SubmitButton>
                </Link>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>

      {/* Popular Product Category */}
      <MaxWidthWrapper>
        <PopularProductCategory />
      </MaxWidthWrapper>

      {/* Shop by Category */}
      <MaxWidthWrapper>
        <ShopByCategory
          sectionTitle="Shop by Category"
          feature={{
            image: "/img/product.svg",
            title: "Viva!",
            subtitle: "Your Fashion Choice",
          }}
          isProduct={true}
        />
      </MaxWidthWrapper>

      {/* Popular Service Category */}
      <MaxWidthWrapper>
        <PopularServiceCategory />
      </MaxWidthWrapper>

      {/* Shop by Category */}
      <MaxWidthWrapper>
        <ShopByCategory
          sectionTitle="Shop by Service Category"
          feature={{
            image: "/img/service.svg",
            title: "Top Notch Services",
            subtitle: "Best Professionals",
          }}
          isService={true}
        />
      </MaxWidthWrapper>

      {/* Recommended for You (API-powered) */}
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
            fontSize="text-[42px]"
            data={recommendedProducts.data.data}
            hasButton={false}
            showViewMore={true}
            viewMoreLink="/recommended"
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No recommended products found</div>
          </div>
        )}
      </MaxWidthWrapper>

      {/* Today's Deal */}
      <MaxWidthWrapper>
        <TodaysDeal />
      </MaxWidthWrapper>

      {/* What's Trending Now */}
      <MaxWidthWrapper>
        <WhatsTrendingNow />
      </MaxWidthWrapper>

      {/* Customer Testimonials */}
      <MaxWidthWrapper>
        <CustomerTestimonials />
      </MaxWidthWrapper>
    </div>
  );
}