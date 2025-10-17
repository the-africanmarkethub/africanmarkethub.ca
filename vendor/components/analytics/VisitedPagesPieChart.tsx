"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Top Deals", value: 547914, percentage: 81.94 },
  { name: "Fashion", value: 547914, percentage: 81.94 },
  { name: "Electronics", value: 547914, percentage: 81.94 },
];

const COLORS = ["#2563eb", "#f59e0b", "#ef4444"];

const VisitedPagesPieChart = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg">
      {/* Chart Container */}
      <div className="h-64 mb-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table Header */}
      <div className="w-full grid grid-cols-3 gap-4 border-b border-gray-200 bg-[#F5F6F7] px-6 py-2">
        <h3 className="text-[10px] leading-[10px] text-nowrap font-medium text-[#4A5154] uppercase tracking-wide">
          PAGE NAME
        </h3>
        <h3 className="text-[10px] leading-[10px] text-nowrap font-medium text-[#4A5154] uppercase tracking-wide text-center">
          TOTAL USERS
        </h3>
        <h3 className="text-[10px] leading-[10px] text-nowrap font-medium text-[#4A5154] uppercase tracking-wide text-right">
          BOUNCE RATE
        </h3>
      </div>

      {/* Table Rows */}
      <div className="w-full space-y-4 px-0 pt-4 sm:px-6">
        {data.map((item, index) => (
          <div key={item.name} className="grid grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-[#191B1C] font-normal">
                {item.name}
              </span>
            </div>
            <div className="text-sm text-[#656565] font-normal text-center">
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm text-[#009900] font-medium text-right">
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitedPagesPieChart;
