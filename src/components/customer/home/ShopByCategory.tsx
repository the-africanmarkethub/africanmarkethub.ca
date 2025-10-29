import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PopularCategoryCard from "./PopularCategoryCard";
import useCategories from "@/hooks/customer/useCategories";
import { useCategoryProducts } from "@/hooks/customer/useCategoryProducts";
import Link from "next/link";
import { Category } from "@/types/customer/category.types";
import { Product } from "@/types/customer/product.types";

// Calculate discount percentage
const calculateDiscount = (
  regularPrice: string,
  salesPrice: string
): string => {
  const regular = parseFloat(regularPrice);
  const sales = parseFloat(salesPrice);
  if (regular <= sales) return "";
  const discount = Math.round(((regular - sales) / regular) * 100);
  return `${discount}% OFF`;
};

interface ShopByCategoryProps {
  sectionTitle: string;
  feature: {
    image: string;
    title: string;
    subtitle: string;
  };
  isProduct?: boolean;
  isService?: boolean;
}

export default function ShopByCategory({
  sectionTitle,
  feature,
  isProduct,
  isService,
}: ShopByCategoryProps) {
  const [mounted, setMounted] = useState(false);
  const type = isService ? "services" : "products";
  const { data: categories, isLoading, error } = useCategories(type);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find a fashion/clothing category for product offers
  const fashionCategory =
    categories?.find(
      (cat: Category) =>
        cat.name.toLowerCase().includes("fashion") ||
        cat.name.toLowerCase().includes("clothing") ||
        cat.name.toLowerCase().includes("apparel") ||
        cat.name.toLowerCase().includes("wear")
    ) || categories?.find((cat: Category) => cat.parent_id === null); // fallback to first parent category

  // Get the first subcategory if main category has children, otherwise use main category
  const categoryToUse =
    fashionCategory?.children && fashionCategory.children.length > 0
      ? fashionCategory.children[0]
      : fashionCategory;

  const { data: categoryProducts, isLoading: productsLoading } =
    useCategoryProducts(isProduct && categoryToUse ? categoryToUse.id : "");

  // Filter for parent categories and take the first 6
  const parentCategories =
    categories?.filter((cat: Category) => cat.parent_id === null).slice(0, 6) ||
    [];

  // Get first 2 products for offers
  const featuredProducts = categoryProducts?.products?.data?.slice(0, 2) || [];

  return (
    <section className="my-8 md:my-12">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">{sectionTitle}</h2>
        <Link href="/customer/categories/product" passHref>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-[#F3EDE7] bg-white text-primary">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* feature Card with Offers */}
        <div
          className="w-full lg:w-1/2 relative bg-[#F6F6F6] rounded-[16px] md:rounded-[24px] overflow-hidden flex flex-col justify-end min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[952.83px] h-full"
          style={{ minWidth: 0 }}
        >
          <Image
            src={feature.image}
            alt="feature"
            fill
            className="object-cover rounded-[16px] md:rounded-[24px]"
          />
          {isProduct && (
            <div className="absolute inset-0 pt-[60px] sm:pt-[80px] md:pt-[120px] lg:pt-[155px] flex flex-col items-center text-white bg-black/20 rounded-[16px] md:rounded-[24px]">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[54px] leading-tight lg:leading-[63px] font-semibold mb-2 md:mb-4 drop-shadow text-center px-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-[28px] font-semibold mb-4 md:mb-6 drop-shadow text-center px-4">
                {feature.subtitle}
              </p>
              <Link href="/customer/categories/product" passHref>
                <button className="border border-white rounded-full px-4 py-2 md:px-6 md:py-3 lg:p-4 text-white text-xs sm:text-sm md:text-base font-medium bg-transparent hover:bg-white hover:text-primary transition">
                  Shop Now!
                </button>
              </Link>
            </div>
          )}

          {isService && (
            <div className="absolute inset-0 pt-[250px] sm:pt-[300px] md:pt-[400px] lg:pt-[644px] flex flex-col items-center text-white bg-black/20 rounded-[16px] md:rounded-[24px]">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[54px] leading-tight lg:leading-[63px] font-semibold mb-2 md:mb-4 drop-shadow text-center px-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-[28px] font-semibold mb-4 md:mb-6 drop-shadow text-center px-4">
                {feature.subtitle}
              </p>
              <Link href="/customer/categories/product" passHref>
                <button className="border border-white rounded-full px-4 py-2 md:px-6 md:py-3 lg:p-4 text-white text-xs sm:text-sm md:text-base font-medium bg-transparent hover:bg-white hover:text-primary transition">
                  Hire Now!
                </button>
              </Link>
            </div>
          )}

          {/* Offer Cards */}
          {isProduct && (
            <div className="absolute left-2 right-2 sm:left-4 sm:right-4 md:left-8 md:right-8 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-36 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4">
              {productsLoading
                ? // Loading skeleton for product cards
                  Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow p-2 sm:p-3 md:p-4 w-full sm:w-1/2 md:w-full lg:w-[379px]"
                    >
                      <div className="w-full h-[80px] sm:h-[100px] md:h-[150px] mb-2 bg-gray-200 animate-pulse rounded-lg md:rounded-xl" />
                      <div className="h-3 bg-gray-200 animate-pulse rounded mb-1 w-16" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-1 w-full" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                    </div>
                  ))
                : featuredProducts.map((product: Product, index: number) => {
                    const discount = calculateDiscount(
                      product.regular_price,
                      product.sales_price
                    );
                    const rating = product.average_rating || 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/customer/products/${product.slug}`}
                        className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow p-2 sm:p-3 md:p-4 flex flex-col items-start w-full sm:w-1/2 md:w-full lg:w-[379px] border hover:shadow-lg transition-shadow ${
                          index === 0
                            ? "border-[#1E90FF]"
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-full h-[80px] sm:h-[100px] md:h-[150px] mb-2 relative rounded-lg md:rounded-xl overflow-hidden">
                          <Image
                            src={product.images[0] || "/img/product.svg"}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg md:rounded-xl"
                          />
                        </div>
                        {discount && (
                          <span className="text-xs text-[#F7931E] font-semibold mb-1">
                            {discount}
                          </span>
                        )}
                        <div className="flex w-full items-center justify-between text-yellow-400 mb-1">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs sm:text-sm md:text-base ${
                                  i < Math.floor(rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-400 text-[8px] sm:text-[10px] md:text-[12px] ml-2">
                            {product.views || 0} views
                          </span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold text-xs sm:text-sm md:text-base text-black">
                            ${product.sales_price}
                          </span>
                          {parseFloat(product.regular_price) >
                            parseFloat(product.sales_price) && (
                            <span className="line-through text-gray-400 text-xs">
                              ${product.regular_price}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
            </div>
          )}
        </div>

        {/* Category Cards Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4 place-content-start">
          {!mounted || isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg h-40 sm:h-48 md:h-56"
              ></div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              Failed to load categories.
            </div>
          ) : (
            parentCategories.map((cat) => (
              <PopularCategoryCard
                key={cat.id}
                image={cat.image || "/assets/default.png"}
                label={cat.name}
                color="#F8F8F8"
                href={`/customer/products/category/${cat.id}?name=${encodeURIComponent(
                  cat.name
                )}`}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
