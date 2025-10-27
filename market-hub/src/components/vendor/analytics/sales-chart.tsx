"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    channel: "Direct Sales",
    value: 300,
  },
  {
    channel: "Channel Partners",
    value: 250,
  },
  {
    channel: "Online",
    value: 200,
  },
];

export default function SalesChart() {
  return (
    <div className="w-full h-full p-5 bg-white rounded-[16px]">
      <h2 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8 mb-6">
        Sales Channel Distribution
      </h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              type="number"
              domain={[0, 400]}
              ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#86909C" }}
            />
            <YAxis
              type="category"
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#86909C" }}
              width={90}
            />
            <Bar dataKey="value" fill="#ff8c00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-right -mt-8 pl-6">
        <span className="text-sm text-gray-500">Unit</span>
      </div>
    </div>
  );
}
