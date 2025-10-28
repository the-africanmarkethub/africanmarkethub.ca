"use client";
import React, { useState, useMemo } from "react";
import {
  OrderHistoryTable,
  OrderHistoryRow,
} from "@/components/ui/OrderHistoryTable";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/customer/useOrders";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h1 className="text-[20px] font-medium text-gray-900">My Orders</h1>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-yellow-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            You don&apos;t have any order yet!
          </h2>
          <p className="text-gray-600 mb-8">
            Explore and place your first order now!
          </p>

          <Button
            onClick={() => router.push("/customer")}
            className="px-8 py-3 bg-[#E7931A] text-white hover:bg-[#E7931A]/90 rounded-full"
          >
            Explore Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow">
        <h1 className="text-[20px] font-medium text-gray-900">My Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg">
        <OrderHistoryTable
          data={transformedOrders}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
          onViewDetails={(orderId) =>
            router.push(`/customer/account/orders/${orderId}`)
          }
        />
      </div>
    </div>
  );
}
