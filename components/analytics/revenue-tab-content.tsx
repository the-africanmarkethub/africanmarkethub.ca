import React from "react";
import RevenueBreakdown from "./revenue-breakdown";
import RevenueProductTable from "./revenue-product-table";
import SalesChart from "./sales-chart";
import RevenueTrends from "./revenue-trends";

export default function RevenueTabContent() {
  return (
    <div className="space-y-6 xl:space-y-8">
      <RevenueBreakdown />
      <RevenueProductTable />
      <div className="grid grid-cols-1 h-full gap-6 xl:gap-8 xl:grid-cols-[0.6fr_0.4fr]">
        <SalesChart />
        <RevenueTrends />
      </div>
    </div>
  );
}
