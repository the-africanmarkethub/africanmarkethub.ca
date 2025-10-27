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
      <div className="py-11 mx-8 pl-20  bg-[#FFFBED] mb-[43px]">
        <MaxWidthWrapper className="flex gap-8 flex-col md:flex-row">
          <AdvertCarousel />
          <div className="md:space-y-6 w-full md:w-[624px]">
            <div className="md:space-y-6  text-[#292929]">
              <h1 className="text-[28px] md:text-[54px] py-2 font-semibold leading-[44px] md:leading-[63px]">
                Welcome to Africa&apos;s leading online marketplace.
              </h1>
              <p className="text-xs md:text-lg py-2 leading-[27px] font-normal">
                Discover a variety of authentic African products, from fashion
                and crafts to fresh produce and electronics.
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <SubmitButton className="w-[190px] md:w-[250px] text-sm rounded-[39px] h-[44px] md:h-14">
                Explore market place
              </SubmitButton>
              <Link href="/sign-up">
                <SubmitButton className="w-[120px] text-sm md:w-[153px] bg-[#FFFFFF] text-[#0D0C0D] hover:bg-[#FFFFFF] border border-[#9C5432] rounded-[39px] h-14">
                  Get started
                </SubmitButton>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
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

      {/* Service Providers */}
      {/* <MaxWidthWrapper>
        <ServiceProviders />
      </MaxWidthWrapper> */}

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
          // categories={shopByCategoryCategories}
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
