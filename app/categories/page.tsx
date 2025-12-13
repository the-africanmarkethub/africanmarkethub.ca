"use client";

import Image from "next/image";
import Link from "next/link";
import { useProductCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data: categoriesResponse, isLoading } = useProductCategories();

  const parentCategories =
    categoriesResponse?.categories?.filter((category) => !category.parent_id) ||
    [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[500px]"
        style={{ backgroundColor: "#FFFBED" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/icon/cat.svg"
            alt="Categories"
            fill
            className="object-cover object-right"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Product Categories
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Discover everything you need in one place
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-200 h-10 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {parentCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/products/${category.id}`}
                  className="group relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="aspect-[4/3] bg-gray-200 relative">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-[#F28C0D] text-white px-4 py-3 rounded-lg text-center font-semibold shadow-lg">
                      {category.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && parentCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                No categories available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
