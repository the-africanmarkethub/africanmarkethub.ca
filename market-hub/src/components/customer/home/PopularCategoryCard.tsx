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
      className="relative block overflow-hidden shadow bg-[#F6F6F6]  h-[191.19px] md:h-[300px] rounded-[8.42px] md:rounded-[13.21px]"
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover rounded-[8.42px] md:rounded-[13.21px]"
      />
      <div
        className={`absolute left-2 right-2 bottom-2 md:left-8 md:right-8 md:bottom-4 px-2 py-1.5 md:px-10 md:py-3 rounded-lg md:rounded-xl text-white font-semibold bg-primary text-xs md:text-[16px] ${color} flex justify-center border-solid border-t-0 border-r-[2px] border-b-[2px] border-l-0 border-[#9C5432] shadow ${labelClassName}`}
      >
        {label}
      </div>
      {children}
    </Link>
  );
}
