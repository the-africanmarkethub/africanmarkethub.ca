"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueData = [
  {
    month: "Jan",
    "Food & Beverages": 650,
    Electronics: 850,
    Apparel: 620,
  },
  {
    month: "Feb",
    "Food & Beverages": 350,
    Electronics: 520,
    Apparel: 420,
  },
  {
    month: "Mar",
    "Food & Beverages": 780,
    Electronics: 280,
    Apparel: 560,
  },
  {
    month: "Apr",
    "Food & Beverages": 520,
    Electronics: 350,
    Apparel: 480,
  },
  {
    month: "May",
    "Food & Beverages": 650,
    Electronics: 520,
    Apparel: 720,
  },
  {
    month: "Jun",
    "Food & Beverages": 540,
    Electronics: 320,
    Apparel: 640,
  },
  {
    month: "Jul",
    "Food & Beverages": 520,
    Electronics: 720,
    Apparel: 1000,
  },
  {
    month: "Aug",
    "Food & Beverages": 950,
    Electronics: 820,
    Apparel: 580,
  },
  {
    month: "Sep",
    "Food & Beverages": 720,
    Electronics: 520,
    Apparel: 420,
  },
  {
    month: "Oct",
    "Food & Beverages": 450,
    Electronics: 620,
    Apparel: 820,
  },
  {
    month: "Nov",
    "Food & Beverages": 650,
    Electronics: 450,
    Apparel: 680,
  },
  {
    month: "Dec",
    "Food & Beverages": 450,
    Electronics: 720,
    Apparel: 250,
  },
];

export default function RevenueBreakdown() {
  return (
    <div className="w-full p-4 bg-white rounded-[21px] mt-4 md:p-6">
      <h2 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8">
        Revenue Breakdown
      </h2>

      <div className="h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueData}
            margin={{
              top: 20,
              right: 30,
              left: 5,
              bottom: 60,
            }}
            barCategoryGap={60}
            maxBarSize={60}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              label={{
                value: "Amount",
                position: "insideLeft",
                angle: -90,
                offset: 0,
                style: { textAnchor: "top", fill: "#666", fontSize: "14px" },
              }}
              domain={[0, 1000]}
              tickFormatter={(value) => `${value.toFixed(2)}`}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
            <Bar
              dataKey="Food & Beverages"
              fill="#FF9500"
              radius={[2, 2, 0, 0]}
              name="Food & Beverages"
            />
            <Bar
              dataKey="Electronics"
              fill="#E84646"
              radius={[2, 2, 0, 0]}
              name="Electronics"
            />
            <Bar
              dataKey="Apparel"
              fill="#0E5FD9"
              radius={[2, 2, 0, 0]}
              name="Apparel"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
