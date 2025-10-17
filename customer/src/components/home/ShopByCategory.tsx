import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PopularCategoryCard from "./PopularCategoryCard";
import useCategories from "@/hooks/useCategories";
import { useCategoryProducts } from "@/hooks/useCategoryProducts";
import Link from "next/link";
import { Category } from "@/types/category.types";
import { Product } from "@/types/product.types";

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
  const type = isService ? "services" : "products";
  const { data: categories, isLoading, error } = useCategories(type);

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
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">{sectionTitle}</h2>
        <Link href="/categories/product" passHref>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#F3EDE7] bg-white text-primary">
            <ArrowUpRight />
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* feature Card with Offers */}
        <div
          className="w-full md:w-1/2 relative bg-[#F6F6F6] rounded-[16px] md:rounded-[24px] overflow-hidden flex flex-col justify-end min-h-[600px] md:min-h-[952.83px] h-full"
          style={{ minWidth: 0 }}
        >
          <Image
            src={feature.image}
            alt="feature"
            fill
            className="object-cover rounded-[24px]"
          />
          {isProduct && (
            <div className="absolute inset-0 pt-[80px] md:pt-[155px] flex flex-col items-center text-white bg-black/20 rounded-[16px] md:rounded-[24px]">
              <h3 className="text-[28px] md:text-[54px] leading-[34px] md:leading-[63px] font-semibold mb-2 drop-shadow">
                {feature.title}
              </h3>
              <p className="text-[16px] md:text-[28px] font-semibold mb-4 drop-shadow">
                {feature.subtitle}
              </p>
              <Link href="/categories/product" passHref>
                <button className="border border-white rounded-full p-3 md:p-4 text-white text-sm md:text-base font-medium bg-transparent hover:bg-white hover:text-primary transition">
                  Shop Now!
                </button>
              </Link>
            </div>
          )}

          {isService && (
            <div className="absolute inset-0 pt-[400px] md:pt-[644px] flex flex-col items-center text-white bg-black/20 rounded-[16px] md:rounded-[24px]">
              <h3 className="text-[28px] md:text-[54px] leading-[34px] md:leading-[63px] font-semibold mb-2 drop-shadow">
                {feature.title}
              </h3>
              <p className="text-[16px] md:text-[28px] font-semibold mb-4 drop-shadow">
                {feature.subtitle}
              </p>
              <Link href="/categories/product" passHref>
                <button className="border border-white rounded-full p-3 md:p-4 text-white text-sm md:text-base font-medium bg-transparent hover:bg-white hover:text-primary transition">
                  Hire Now!
                </button>
              </Link>
            </div>
          )}

          {/* Offer Cards */}
          {isProduct && (
            <div className="absolute left-4 right-4 md:left-8 md:right-8 bottom-8 md:bottom-36 flex flex-row justify-center gap-3 md:gap-4">
              {productsLoading
                ? // Loading skeleton for product cards
                  Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 w-full md:w-[379px]"
                    >
                      <div className="w-full h-[100px] md:h-[150px] mb-2 bg-gray-200 animate-pulse rounded-lg md:rounded-xl" />
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
                        href={`/products/${product.slug}`}
                        className={`bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 flex flex-col items-start w-full md:w-[379px] border hover:shadow-lg transition-shadow ${
                          index === 0
                            ? "border-[#1E90FF]"
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-full h-[100px] md:h-[150px] mb-2 relative rounded-lg md:rounded-xl overflow-hidden">
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
                        <div className="flex w-full items-center justify-between text-yellow-400 text-lg md:text-2xl mb-1">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm md:text-base ${
                                  i < Math.floor(rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-400 text-[10px] md:text-[12px] ml-2">
                            {product.views || 0} views
                          </span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold text-sm md:text-base text-black">
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
        <div className="w-full md:w-1/2 grid grid-cols-2 lg:grid-cols-2 gap-4 place-content-start">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg h-48"
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
                href={`/products/category/${cat.id}?name=${encodeURIComponent(
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
