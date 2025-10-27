import { Card, CardContent, CardHeader, CardTitle } from "@/components/vendor/ui/card";
import { TrendingDown } from "lucide-react";

const SparklineChart = ({
  color,
  points,
}: {
  color: string;
  points: string;
}) => (
  <div className="relative h-16 w-24">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 96 64"
      className="absolute inset-0"
    >
      <defs>
        <linearGradient
          id={`gradient-${color}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d={points}
        stroke={color}
        strokeWidth="2"
        fill="none"
        className="drop-shadow-sm"
      />
      <path d={`${points} L 96 64 L 0 64 Z`} fill={`url(#gradient-${color})`} />
    </svg>
  </div>
);

export default function RevenueTrends() {
  const revenueTrendsData = [
    {
      title: "MTD Revenue",
      amount: "24,500 CAD",
      change: "11.2%",
      color: "#3b82f6",
      points: "M 0 32 Q 16 28 24 24 T 48 20 Q 64 18 72 22 T 96 28",
    },
    {
      title: "YTD Revenue",
      amount: "142,000 CAD",
      change: "11.2%",
      color: "#10b981",
      points: "M 0 40 Q 20 35 32 30 T 56 25 Q 72 28 80 35 T 96 45",
    },
    {
      title: "Projected Q2",
      amount: "87,500 CAD",
      change: "11.2%",
      color: "#8b5cf6",
      points: "M 0 45 Q 16 35 28 30 T 52 25 Q 68 28 76 35 T 96 42",
    },
  ];

  return (
    <div className="w-full h-full">
      <Card className="bg-white border-none rounded-[16px] p-6">
        <CardHeader className="pb-4 px-0">
          <CardTitle className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8">
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          {revenueTrendsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[16px] leading-[22px] font-normal text-[#656565]">
                  {item.title}
                </p>
                <p className="text-2xl font-semibold text-[#1D2129] mb-2">
                  {item.amount}
                </p>
                <div className="flex items-center text-xs/5 font-normal text-[#F53F3F]">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  <span>{item.change}</span>
                  <span className="text-[#86909C] ml-1">per year</span>
                </div>
              </div>
              <div className="ml-4">
                <SparklineChart color={item.color} points={item.points} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
