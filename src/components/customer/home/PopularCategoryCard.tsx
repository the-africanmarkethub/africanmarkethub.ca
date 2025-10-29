import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PopularCategoryCardProps {
  image: string;
  label: string;
  color: string;
  href: string;
  labelClassName?: string;
  children?: React.ReactNode;
}

export default function PopularCategoryCard({
  image,
  label,
  color,
  href,
  labelClassName = "",
  children,
}: PopularCategoryCardProps) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden shadow bg-[#F6F6F6] h-[160px] sm:h-[191.19px] md:h-[240px] lg:h-[300px] rounded-[8.42px] md:rounded-[13.21px] hover:shadow-lg transition-shadow"
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover rounded-[8.42px] md:rounded-[13.21px]"
      />
      <div
        className={`absolute left-1.5 right-1.5 bottom-1.5 sm:left-2 sm:right-2 sm:bottom-2 md:left-4 md:right-4 md:bottom-3 lg:left-8 lg:right-8 lg:bottom-4 px-2 py-1 sm:px-2 sm:py-1.5 md:px-4 md:py-2 lg:px-10 lg:py-3 rounded-md sm:rounded-lg md:rounded-xl text-white font-semibold bg-primary text-[10px] sm:text-xs md:text-sm lg:text-[16px] ${color} flex justify-center border-solid border-t-0 border-r-[2px] border-b-[2px] border-l-0 border-[#9C5432] shadow ${labelClassName}`}
      >
        {label}
      </div>
      {children}
    </Link>
  );
}
