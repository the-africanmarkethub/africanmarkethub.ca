"use client";

import { PageHeader } from "@/components/vendor/page-header";
import { StatsCard } from "@/components/vendor/dashboard/StatsCard";
import { useGetOrderStats } from "@/hooks/vendor/useGetOrderStats";
import { OrderTable } from "@/components/vendor/order/order-table";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface RawOrder {
  id: number;
  customer: { name?: string; last_name?: string };
  order_items: {
    id: number;
    product?: { title?: string; images?: string[] };
    price?: string;
    quantity?: number;
    shipping_status?: string;
  }[];
  created_at: string;
  address?: string;
  payment_status: string;
  shipping_status: string;
}

export interface OrderWithProductImage {
  id: number;
  customer: string;
  orderItems: {
    id: number;
    product: string;
    qty: number;
    price: string;
    image?: string;
    shippingStatus: "Shipped" | "Pending" | "Delivered" | "Cancelled";
  }[];
  totalQty: number;
  totalPrice: string;
  date: string;
  address: string;
  paymentStatus: "Pending" | "Paid";
  status: "Pending" | "Delivered" | "Cancelled";
}

export default function ProcessedOrderPage() {
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
    <div className="flex-1 space-y-8 p-8">
      <PageHeader
        title="Order Management"
        description="View and manage your orders"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <StatsCard {...currentOrderStats} />
        <StatsCard {...completedOrderStats} />
      </div>

      <OrderTable view heading="Order Details" />
    </div>
  );
}
