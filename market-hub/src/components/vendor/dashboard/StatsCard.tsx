"use client";

import { Card } from "@/components/vendor/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import Image from "next/image";

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsCardProps {
  icon?: string;
  items: StatItem[];
  period?: string;
  center?: boolean;
}

export function StatsCard({
  icon,
  items,
  period = "This Week",
  center,
}: StatsCardProps) {
  return (
    <Card className={`p-3 sm:p-4 border-[1px] rounded-[16px] bg-[#FFFFFF] md:p-6`}>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header with period selector */}
        <div className="flex items-center justify-between">
          {icon && (
            <div className="w-10 h-10 rounded-full bg-[#FFF6E9] flex items-center justify-center">
              <Image src={icon} width={32} height={32} alt="" />
            </div>
          )}
          <Select defaultValue={period.toLowerCase().replace(" ", "_")}>
            <SelectTrigger className="w-[100px] h-[24px] font-semibold text-[8px] leading-[10px] border border-[#EEEEEE] bg-transparent hover:bg-transparent md:text-xs">
              <SelectValue placeholder="This Week" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[8px] font-semibold">
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="flex justify-between gap-2 sm:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                center ? "items-center" : ""
              } space-y-1 sm:space-y-2 min-w-0`}
            >
              <p className="text-xs sm:text-sm font-normal text-[#7C7C7C] truncate">{item.label}</p>
              <p className="text-sm sm:text-lg/6 font-medium md:text-[20px] truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
