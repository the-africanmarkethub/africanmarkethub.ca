"use client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/vendor/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";

type DonutData = {
  name: string;
  value: number;
  color: string;
}[];

interface DonutChartProps {
  title: string;
  data: DonutData;
  total: number;
  chartDirection?: "column" | "row";
  legendDirection?: "column" | "row";
  period?: string;
  enablePeriod?: boolean;
}

const DonutChart = ({ data, total }: { data: DonutData; total: number }) => {
  const radius = 131;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativePercentage = 0;

  return (
    <div className="relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {data.map((item, index) => {
          const strokeDasharray = `${
            (item.value / 100) * circumference
          } ${circumference}`;
          const strokeDashoffset =
            (-cumulativePercentage * circumference) / 100;
          cumulativePercentage += item.value;

          return (
            <circle
              key={index}
              stroke={item.color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-300 ease-in-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs/5 text-[#4E5969] font-normal">Total</span>
        <span className="text-[2rem] leading-10 font-medium text-[#1D2129]">
          {total}
        </span>
      </div>
    </div>
  );
};

export default function CustomDonutChart(props: DonutChartProps) {
  const chartDirection = props.chartDirection ?? "column";
  const legendDirection = props.legendDirection ?? "row";
  const period = props.period ?? "This Week";
  const enablePeriod = props.enablePeriod ?? true;

  const isMobile = useIsMobile();

  // Avoid hydration mismatch by not rendering until value is set
  if (typeof window !== "undefined" && isMobile === undefined) {
    return null;
  }

  return (
    <div className="p-8 bg-white rounded-[12px]">
      <div className="flex justify-between">
        <h1 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8 mb-14">
          {props.title}
        </h1>
        {enablePeriod && (
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
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-y-6 gap-x-20",
          chartDirection === "row" && "flex-row",
          isMobile &&
            chartDirection === "row" &&
            "flex-col items-center w-full justify-between"
        )}
      >
        <div className="flex flex-col items-center mb-6">
          <DonutChart data={props.data} total={props.total} />
        </div>

        <div
          className={cn(
            "flex flex-col justify-center gap-y-6 gap-x-[43px] md:flex-row",
            legendDirection === "column" && "flex-col"
          )}
        >
          {props.data?.map((item, index) => (
            <div
              key={item.name + index}
              className="flex items-center space-x-3"
            >
              <div
                className="w-1 h-7 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div
                className={cn(
                  "flex flex-col w-full",
                  legendDirection === "column" &&
                    "flex-row items-center gap-x-6"
                )}
              >
                <h1 className="text-[#4E5969] font-normal text-sm">
                  {item.name}
                </h1>
                <p className="text-xl text-[#1D2129] font-medium">
                  {item.value}
                  <span className="text-xs/7 font-normal text-[#86909C] ml-1">
                    %
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
