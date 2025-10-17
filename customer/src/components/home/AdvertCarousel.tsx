import Image from "next/image";
import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const sliderImages = [
  {
    web: "/img/Rectangle 1465 African Market Hub (1).svg",
    mobile: "/img/Rectangle 1465 African Market Hub (1).svg",
  },
  {
    web: "/img/African Market Hub Rectangle.svg",
    mobile: "/img/African Market Hub Rectangle.svg",
  },
  {
    web: "/img/Rectangle 1465 African Market Hub.svg",
    mobile: "/img/Rectangle 1465 African Market Hub.svg",
  },
];

function AdvertCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="relative w-full md:w-[624px] mt-9 sm:mt-0 rounded-xl md:rounded-[32px] overflow-hidden">
      <Carousel
        showDots={true}
        autoPlay
        autoPlaySpeed={5000}
        infinite
        responsive={responsive}
        transitionDuration={1000}
        arrows={false}
        swipeable={true}
        draggable={true}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {sliderImages.map((item, index) => (
          <div
            onClick={() => {
              //   push("/draws");
            }}
            key={index}
            className="rounded-xl md:rounded-[32px] relative h-[327px] sm:h-[327px] md:h-[849px]"
          >
            <Image
              src={isMobile ? item.mobile : item.web}
              alt={`slider-image-${index}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-xl md:rounded-[32px]"
              priority={index === 0}
            />
          </div>
        ))}
      </Carousel>

      <style jsx global>{`
        .custom-dot-list-style {
          position: absolute !important;
          bottom: 10px !important;
          display: flex !important;
          justify-content: center !important;
          padding: 0 !important;
          margin: 0 !important;
          list-style: none !important;
        }

        .custom-dot-list-style li {
          margin: 0 4px !important;
        }

        .custom-dot-list-style li button {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.5) !important;
          cursor: pointer !important;
        }

        .custom-dot-list-style li.react-multi-carousel-dot--active button {
          background: white !important;
        }

        @media (max-width: 768px) {
          .custom-dot-list-style {
            bottom: 15px !important;
          }

          .custom-dot-list-style li button {
            width: 10px !important;
            height: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdvertCarousel;
