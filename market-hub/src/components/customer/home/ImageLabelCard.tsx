import React from "react";
import Image from "next/image";

interface ImageLabelCardProps {
  image: string;
  label: string;
  color: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  labelClassName?: string;
  children?: React.ReactNode;
}

export default function ImageLabelCard({
  image,
  label,
  color,
  width = 296,
  height = 300,
  borderRadius = 13.21,
  labelClassName = "",
  children,
}: ImageLabelCardProps) {
  return (
    <div
      className="relative overflow-hidden shadow bg-[#F6F6F6]"
      style={{ width, height, borderRadius }}
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover"
        style={{ borderRadius }}
      />
      <div
        className={`absolute left-8 right-8 bottom-4 px-10 py-3 rounded-xl text-white font-semibold text-[20px] ${color} flex justify-center border-solid border-t-0 border-r-[2px] border-b-[2px] border-l-0 border-[#9C5432] shadow ${labelClassName}`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
