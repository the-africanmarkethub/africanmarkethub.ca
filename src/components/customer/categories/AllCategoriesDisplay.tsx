"use client";
import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { Category } from "@/types/customer/category.types";
import Image from "next/image";
import PopularCategoryCard from "@/components/customer/home/PopularCategoryCard";

interface AllCategoriesDisplayProps {
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerButtonText: string;
  pageTitle: string;
  categoryLinkPrefix: "product" | "service";
  categories: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function AllCategoriesDisplay({
  bannerImage,
  bannerTitle,
  bannerSubtitle,
  bannerButtonText,
  pageTitle,
  categoryLinkPrefix,
  categories,
  isLoading,
  error,
}: AllCategoriesDisplayProps) {
  return (
    <div className="w-full mt-9">
      <div className="relative">
        <Image
          src={bannerImage}
          alt="Category Banner"
          width={1440}
          height={400}
          className="w-full h-[200px] md:h-[400px] object-cover"
        />

        {/* Breadcrumb navigation for mobile */}
        <div className="md:hidden absolute top-4 left-4 text-white text-sm">
          <span className="opacity-70">Home</span>
          <span className="mx-2">›</span>
          <span className="opacity-70">Category</span>
          <span className="mx-2">›</span>
          <span>{bannerTitle}</span>
        </div>

        {/* Banner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 md:px-0 md:w-[560px] md:top-[76.5px] md:left-[81px] md:items-start">
          <h1 className="text-[24px] md:text-[54px] font-semibold leading-[28px] md:leading-[63px] text-center md:text-left">
            {bannerTitle}
          </h1>
          <p className="text-[14px] md:text-[28px] font-semibold mt-2 md:mt-4 text-center md:text-left">
            {bannerSubtitle}
          </p>
          <div className="text-sm md:text-base border border-white px-4 py-2 md:p-4 rounded-full md:rounded-4xl leading-[20px] md:leading-[22px] font-medium mt-4 hover:bg-white hover:text-gray-900 transition-colors cursor-pointer">
            {bannerButtonText}
          </div>
        </div>
      </div>

      <MaxWidthWrapper className="my-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{pageTitle}</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg h-60"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load categories. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((cat: Category) => (
              <PopularCategoryCard
                key={cat.id}
                image={cat.image || "/assets/default.png"}
                label={cat.name}
                color="#F8F8F8" // A default or dynamic color
                href={`/${categoryLinkPrefix}/category/${cat.id}?name=${encodeURIComponent(
                  cat.name
                )}`}
              />
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
