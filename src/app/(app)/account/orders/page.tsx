"use client";
import React, { useState, useMemo } from "react";
import {
  OrderHistoryTable,
  OrderHistoryRow,
} from "@/components/ui/OrderHistoryTable";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch orders using the custom hook
  const { data, isLoading, isError, error } = useOrders(currentPage, pageSize);

  console.log("order-------", data);

  // Transform the API data to match the OrderHistoryRow interface
  const transformedOrders: OrderHistoryRow[] = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.map((order) => {
      // Format date from created_at
      const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Count products from order_items
      const productCount = order.order_items?.length || 0;

      // Map shipping_status to display status
      let displayStatus: "Shipping" | "Delivered" | "Cancelled" = "Shipping";
      if (order.shipping_status === "delivered") {
        displayStatus = "Delivered";
      } else if (order.shipping_status === "cancelled") {
        displayStatus = "Cancelled";
      } else if (
        order.shipping_status === "processing" ||
        order.shipping_status === "pending"
      ) {
        displayStatus = "Shipping";
      }

      return {
        id: order.id,
        date: orderDate,
        total: parseFloat(order.total).toFixed(2),
        products: productCount,
        status: displayStatus,
        currency: "NGN", // Based on the API response, this appears to be Nigerian Naira
      };
    });
  }, [data]);

  const totalPages = data?.data?.last_page || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          {error?.message || "Failed to load orders. Please try again later."}
        </p>
      </div>
    );
  }

  if (transformedOrders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <OrderHistoryTable
        data={transformedOrders}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        onViewDetails={(orderId) => router.push(`/account/orders/${orderId}`)}
      />
    </div>
  );
}
