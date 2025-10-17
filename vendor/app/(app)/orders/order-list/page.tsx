"use client";

import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useGetOrderStats } from "@/hooks/useGetOrderStats";
import { OrderTable } from "@/components/order/order-table";

export default function OrderListPage() {
  const { data: orderStatsData } = useGetOrderStats();

  const currentOrderStats = {
    icon: "/assets/icons/wallet.svg",
    items: [
      { label: "All Orders", value: orderStatsData?.data?.total_orders ?? 0 },
      {
        label: "Cancelled",
        value: orderStatsData?.data?.cancelled_orders ?? 0,
      },
      { label: "Ongoing", value: orderStatsData?.data?.ongoing_orders ?? 0 },
      { label: "Shipped", value: orderStatsData?.data?.shipped_orders ?? 0 },
    ],
  };

  const completedOrderStats = {
    icon: "/assets/icons/wallet.svg",
    items: [
      { label: "Completed", value: orderStatsData?.data?.shipped_orders ?? 0 },
      {
        label: "Cancelled",
        value: orderStatsData?.data?.completed_orders ?? 0,
      },
      { label: "Returned", value: 24 },
    ],
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 md:space-y-8">
      <PageHeader title="Order Management" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatsCard {...currentOrderStats} />
        <StatsCard {...completedOrderStats} />
      </div>

      <OrderTable heading="Latest Order" view={true} />
    </div>
  );
}
