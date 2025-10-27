import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

export interface Overview {
  date: string;
  total: string;
}

interface OverviewProps {
  title: string;
  data: Overview[];
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-orange-500 text-white px-3 py-2 rounded-md shadow-lg">
        <p className="font-medium">{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function OverviewChart(props: OverviewProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectOption = (option: string) => {
    props.setSelectedOption(option);
    setIsDropdownOpen(false);

    // const index = salesData.findIndex((item) => item.month === month);
    // if (index !== -1) {
    //   setActiveIndex(index);
    // } else {
    //   setActiveIndex(null);
    // }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 w-full md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg/6 font-semibold text-gray-900 md:text-2xl">
          {props.title}
        </h2>

        {/* Month Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs text-[#292929]">
              {props.selectedOption}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
              {props.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-xs text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={props.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#989898" }}
              className="leading-4"
              tickFormatter={(date: string) => format(new Date(date), "MMM")}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#989898" }}
              tickFormatter={(total) => total.toLocaleString()}
              tickCount={6}
              className="leading-4"
            />
            <Tooltip content={<CustomTooltip />} />
            <CartesianGrid color="#EEEEEE" vertical={false} opacity={0.3} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
