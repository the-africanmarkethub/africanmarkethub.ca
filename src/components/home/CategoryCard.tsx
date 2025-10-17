import React from "react";
import Image from "next/image";

interface CategoryCardProps {
  image: string;
  name: string;
  color: string;
}

export default function CategoryCard({
  image,
  name,
  color,
}: CategoryCardProps) {
  return (
    <div className="relative overflow-hidden shadow bg-[#F6F6F6] w-[296px] h-[300px] rounded-[13.21px]">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover rounded-[13.21px]"
      />
      <div
        className={`absolute left-8 right-8 bottom-4  px-10 py-3 rounded-xl text-white font-semibold text-[20px] ${color} flex justify-center border-solid border-t-0 border-r-[2px] border-b-[2px] border-l-0 border-[#9C5432] shadow`}
      >
        {name}
      </div>
    </div>
  );
}
