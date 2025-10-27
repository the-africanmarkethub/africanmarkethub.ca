import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ItemCard from "../home/ItemCard";
import { Product } from "@/types/customer/product.types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1,
  },
};

interface RecommendedProductProps {
  data: Product[];
}

export default function RecommendedProductCarousel({
  data,
}: RecommendedProductProps) {
  const CustomLeftArrow = ({ onClick }: any) => (
    <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10">
      <button 
        onClick={onClick}
        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );

  const CustomRightArrow = ({ onClick }: any) => (
    <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10">
      <button 
        onClick={onClick}
        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h1 className="text-lg md:text-[28px] font-semibold">Recommended for You</h1>
        <Link href="/recommended">
          <button className="flex items-center gap-1 text-sm md:text-base text-primary hover:text-primary-dark transition-colors">
            <span>View all</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      <Carousel
        showDots={false}
        autoPlay={false}
        infinite
        responsive={responsive}
        transitionDuration={300}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        arrows={true}
        swipeable={true}
        draggable={true}
        containerClass="relative"
        itemClass="px-1 md:px-2"
      >
        {data.map((product: Product) => (
          <ItemCard 
            hasButton={true} 
            item={product} 
            key={product.id}
            displayRegular={false}
          />
        ))}
      </Carousel>
    </div>
  );
}
