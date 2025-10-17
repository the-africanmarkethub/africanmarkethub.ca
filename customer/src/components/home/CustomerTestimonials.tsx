import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { useProductReviews } from "@/hooks/useProductReviews";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    partialVisibilityGutter: 20,
  },
};

type Testimonial = {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar?: string;
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="bg-white border border-[#292929] text-sm rounded-[16px]  p-6 flex flex-col justify-between md:min-h-[320px] max-w-[480px] mx-auto"
      style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}
    >
      <div>
        <div className="flex items-center mb-4">
          <Quote className="text-[#F7931E] md:w-[32px] md:h-[26px] mr-2" />
        </div>
        <div className="text-[#464646] text-[12px] mb-3 md:text-base leading-4 md:leading-7 md:mb-8">
          {testimonial.text}
        </div>
      </div>
      <div className="flex items-center gap-4 md:mt-auto">
        {testimonial.avatar ? (
          <>
            {" "}
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={56}
              height={56}
              className="rounded-full hidden object-cover"
            />
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={42}
              height={42}
              className="rounded-full object-cover"
            />
          </>
        ) : (
          <div className="md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center text-white text-xs md:text-xl font-bold">
            {testimonial.name[0]}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-normal text-xs md:text-base text-[#222]">
            {testimonial.name}
          </span>
          <span className="text-[#999999] font-normal text-xs md:text-base">
            Customer
          </span>
        </div>
        <div className="flex gap-1 ml-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < testimonial.rating
                  ? "text-yellow-400 text-sm md:text-xl"
                  : "text-gray-300 text-xl"
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerTestimonials() {
  const { data: reviews, isLoading, error } = useProductReviews();

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        What our Customer Says
      </h2>
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48 text-red-500">
            Failed to load testimonials.
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            arrows
            customLeftArrow={
              <button className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full border border-[#BDBDBD] bg-white text-primary shadow">
                <ArrowLeft />
              </button>
            }
            customRightArrow={
              <button className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full border border-[#BDBDBD] bg-white text-primary shadow">
                <ArrowRight />
              </button>
            }
            itemClass="px-4"
            containerClass="pb-8"
          >
            {reviews?.map((review) => (
              <TestimonialCard
                key={review.id}
                testimonial={{
                  id: review.id,
                  name: `${review.user.name} ${review.user.last_name}`,
                  text: review.comment,
                  rating: review.rating,
                  avatar: review.user.profile_photo,
                }}
              />
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
