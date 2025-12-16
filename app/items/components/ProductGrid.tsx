"use client";

import { FC } from "react";
import Image from "next/image";
import { formatAmount } from "@/utils/formatCurrency";
import Skeleton from "react-loading-skeleton";
import Product from "@/interfaces/items";
import EmptyItem from "./EmptyItem";
import { optimizeImage } from "@/utils/optimizeImage";
import Link from "next/link";
import { StarFilled, StarEmpty } from "@/utils/ItemUtils";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: string;
  onClickItem?: (product: Product) => void;
  limit?: number;
  variant?: "grid" | "horizontal";
}

const ProductGrid: FC<ProductGridProps> = ({
  products,
  loading = false,
  columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3",
  onClickItem,
  limit = 12,
  variant = "grid",
}) => {
  const renderSkeletons = () =>
    Array.from({ length: limit }).map((_, idx) => (
      <div
        key={idx}
        className="bg-gray-50 rounded-xl overflow-hidden shadow relative"
      >
        <Skeleton height={160} className="w-full h-40" />
        <div className="p-3">
          <Skeleton width={80} height={16} className="mb-2" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} width={60} />
        </div>
      </div>
    ));

  return (
    <>
      {loading ? (
        <div className={`grid ${columns}`}>{renderSkeletons()}</div>
      ) : products.length === 0 ? (
        <EmptyItem message=" No items available." />
      ) : (
        <div className={`grid ${columns}`}>
          {products.map((product) => {
            const salesPrice = parseFloat(product.sales_price);
            const regularPrice = parseFloat(product.regular_price);
            const discount =
              regularPrice > salesPrice
                ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
                : 0;

            return (
              <div
                key={product.id}
                onClick={() => onClickItem?.(product)}
                className={`bg-gray-50 rounded-xl overflow-hidden shadow relative group cursor-pointer hover:p-2 hover:shadow-lg transition-shadow
                            ${
                              variant === "horizontal"
                                ? "min-w-45 snap-start"
                                : ""
                            }
                          `}
              >
                {/* Product Image */}
                <div className="relative">
                  <Image
                    src={optimizeImage(
                      product.images?.[0] || "/placeholder.png",
                      400
                    )}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="w-full h-40 object-cover"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                    quality={70}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100  transition-opacity flex items-center justify-center pointer-events-none">
                    <Link
                      href={`/items/${product.slug}`}
                      className="pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="px-4 py-2 bg-hub-primary text-white text-xs font-semibold rounded-full shadow hover:bg-hub-secondary transition cursor-pointer">
                        Add to Cart
                      </button>
                    </Link>
                  </div>

                  {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-xs px-2 py-1 rounded shadow">
                      -{discount}%
                    </div>
                  )}
                </div>

                <div className="p-3">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center text-[8px]! gap-1 text-yellow-400 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < product.average_rating ? (
                          <StarFilled />
                        ) : (
                          <StarEmpty />
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <p className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">
                      {formatAmount(salesPrice)}
                    </span>

                    {discount > 0 && (
                      <span className="text-[10px] line-through text-gray-600">
                        {formatAmount(regularPrice)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductGrid;
