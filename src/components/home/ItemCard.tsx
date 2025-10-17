import React, { useState, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import Link from "next/link";
import { Product } from "@/types/product.types";
import WishlistButton from "../WishlistButton";

interface ItemCardProps {
  item: Product;
  categoryName?: string | undefined;
  hasButton: boolean;
  displayRegular: boolean;
}

const ItemCard = ({
  item,
  categoryName,
  hasButton,
  displayRegular,
}: ItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate the display price - use first variation price if available, otherwise use item sales_price
  const displayPrice = useMemo(() => {
    if (item.variations && item.variations.length > 0) {
      return item.variations[0].price;
    }
    return item.sales_price;
  }, [item.variations, item.sales_price]);

  const isService = item.type === "services";

  return (
    <Card
      className="p-0 gap-0 border-none shadow-none group transition-all duration-300 hover:scale-105 w-full max-w-[296px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square">
        <WishlistButton
          productId={item.id}
          size="md"
          variant="floating"
          position="top-right"
        />
        <Link href={`/products/${item.slug}?categoryName=${categoryName}`}>
          <Image
            src={item.images[0]}
            fill
            alt=""
            className="rounded-2xl object-cover"
            unoptimized
          />
        </Link>
      </div>

      <CardContent className="py-3 md:py-4 px-3 md:px-4 w-full">
        <div className="flex flex-col gap-1 md:gap-4 w-full">
          <h3 className="text-sm md:text-base font-normal line-clamp-2">
            {item.title}
          </h3>

          {/* Rating */}
          <div className="flex text-yellow-400 text-sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < item.average_rating
                    ? "text-yellow-400 text-lg md:text-2xl"
                    : "text-gray-300 text-lg md:text-2xl"
                }
              >
                ★
              </span>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-[#292929] text-[10px] font-semibold  text-xs md:text-base leading-tight md:leading-8">
              {displayPrice} CAD
            </p>
            {displayRegular && (
              <p className="text-[#BDBDBD] text-[10px] font-semibold text-xs md:text-base leading-tight md:leading-8 line-through">
                {item.regular_price} CAD
              </p>
            )}
          </div>

          {isHovered && hasButton && (
            <Link
              href={`/products/${item.slug}?categoryName=${categoryName}`}
              className="w-full"
            >
              <SubmitButton className="h-[28px] md:h-12 w-full rounded-[39px] animate-fadeIn text-[8px] md:text-base">
                {isService ? "Book Now" : "Add to Cart"}
              </SubmitButton>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
