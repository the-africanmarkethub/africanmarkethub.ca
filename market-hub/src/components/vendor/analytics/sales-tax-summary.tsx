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
    Collected: 650,
    Due: 850,
  },
  {
    month: "Feb",
    Collected: 350,
    Due: 520,
  },
  {
    month: "Mar",
    Collected: 780,
    Due: 280,
  },
  {
    month: "Apr",
    Collected: 520,
    Due: 350,
  },
  {
    month: "May",
    Collected: 650,
    Due: 520,
  },
  {
    month: "Jun",
    Collected: 540,
    Due: 320,
  },
  {
    month: "Jul",
    Collected: 520,
    Due: 720,
  },
  {
    month: "Aug",
    Collected: 950,
    Due: 820,
  },
  {
    month: "Sep",
    Collected: 720,
    Due: 520,
  },
  {
    month: "Oct",
    Collected: 450,
    Due: 620,
  },
  {
    month: "Nov",
    Collected: 650,
    Due: 450,
  },
  {
    month: "Dec",
    Collected: 450,
    Due: 720,
  },
];

export default function SalesTaxSummary() {
  return (
    <div className="w-full p-4 bg-white rounded-[21px] mt-4 md:p-6">
      <h2 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8 mb-8">
        Sales Tax Summary
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
                value: "unit",
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
              dataKey="Collected"
              fill="#F28C0D"
              radius={[2, 2, 0, 0]}
              name="Collected"
            />
            <Bar
              dataKey="Due"
              fill="#EF2D03"
              radius={[2, 2, 0, 0]}
              name="Due"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
