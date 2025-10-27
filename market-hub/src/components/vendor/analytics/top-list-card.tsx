import Image from "next/image";
import React from "react";
// import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  title: string;
  subtitle?: string;
  value: string;
  increase?: boolean;
  percentage?: number;
}

export default function TopListCard(props: Props) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-x-[13px]">
        <Image
          src={props.imgUrl}
          alt="image"
          width={40}
          height={40}
          className="h-8 w-8 xl:w-10 xl:h-10"
        />
        <div className="">
          <p className="text-sm font-medium xl:leading-[22px] xl:text-[16px]">
            {props.title}
          </p>
          {props.subtitle && (
            <p className="text-xs font-normal text-[#656565]">
              {props.subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium xl:leading-[22px] xl:text-[16px]">
          {props.value}
        </p>
        {props.percentage && (
          <div
            className={`px-2 py-1 rounded-[4px] font-medium text-[8px] ${
              props.increase
                ? "bg-[#0099000D] text-[#009900]"
                : "bg-[#F1352B1A] text-[#F1352B]"
            }`}
          >
            {props.percentage} %
          </div>
        )}
      </div>
    </div>
  );
}
