"use client";

import { Pencil, Eye } from "lucide-react";
import { Button } from "@/components/vendor/ui/button";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import { useState } from "react";
import { Badge } from "@/components/vendor/ui/badge";
import TableSkeletonLoader from "../TableSkeletonLoader";
import { useGetOrders } from "@/hooks/vendor/useGetOrders";
import { OrderItemCarousel } from "./OrderItemCarousel";
import { useRouter } from "next/navigation";

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
  address?: { street_address?: string };
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
  paymentStatus: "Pending" | "completed";
  status: "pending" | "delivered" | "Cancelled" | "processing";
}

export function OrderTable({
  // view,
  heading,
}: {
  view?: boolean;
  heading: string;
}) {
  const router = useRouter();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersResponse, isLoading } = useGetOrders(currentPage);

  const orders: OrderWithProductImage[] =
    ordersResponse?.data.data.map((order: RawOrder) => {
      const orderItems = order.order_items.map((item) => ({
        id: item.id,
        product: item.product?.title || "",
        image: item.product?.images?.[0] || "",
        price: item.price || "",
        qty: item.quantity || 0,
        shippingStatus:
          (item.shipping_status as
            | "Shipped"
            | "processing"
            | "delivered"
            | "Cancelled") || "Pending",
      }));

      // Calculate total quantity and price
      const totalQty = orderItems.reduce((sum, item) => sum + item.qty, 0);
      const totalPrice =
        orderItems
          .reduce(
            (sum, item) =>
              sum + parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
            0
          )
          .toFixed(2) + "CAD";

      return {
        id: order.id,
        customer: `${order.customer?.name || ""} ${
          order.customer?.last_name || ""
        }`.trim(),
        orderItems,
        totalQty,
        totalPrice,
        date: new Date(order.created_at).toLocaleDateString(),
        address: order.address?.street_address || "N/A",
        paymentStatus:
          order.payment_status === "completed" ? "completed" : "Pending",
        status: order.shipping_status,
      };
    }) || [];

  const columns = [
    {
      header: "Customer",
      accessorKey: "customer",
      cell: (item: OrderWithProductImage) => (
        <span className="truncate whitespace-nowrap" title={item.customer}>
          {item.customer}
        </span>
      ),
    },
    {
      header: "Products",
      accessorKey: "orderItems",
      cell: (item: OrderWithProductImage) => (
        <div className="w-[130px]">
          <OrderItemCarousel items={item.orderItems} />
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "totalPrice",
    },
    {
      header: "Qty",
      accessorKey: "totalQty",
    },
    { header: "Date", accessorKey: "date" },
    { header: "Address", accessorKey: "address" },
    {
      header: "Payment Status",
      accessorKey: "paymentStatus",
      cell: (item: OrderWithProductImage) => (
        <Badge
          variant={
            item.paymentStatus === "completed" ? "success" : "destructive"
          }
        >
          {item.paymentStatus}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: OrderWithProductImage) => (
        <Badge
          className="px-3"
          variant={
            item.status === "delivered"
              ? "success"
              : item.status === "pending"
                ? "destructive"
                : item.status === "processing"
                  ? "warning"
                  : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  const handleEdit = (item: OrderWithProductImage) => {
    console.log("Edit order:", item.id);
  };

  const handleView = (item: OrderWithProductImage) => {
    router.push(`/vendor/orders/${item.id}`);
  };

  const rowActions = (item: OrderWithProductImage) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
        onClick={() => handleEdit(item)}
        title="Edit Order"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
        onClick={() => handleView(item)}
        title="View Order Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );

  const filters = [
    {
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
      onSelect: (value: string) => console.log("Status filter:", value),
    },
    {
      label: "Date",
      type: "dateRange" as const,
      dateRange,
      onDateRangeChange: (range: DateRange) => {
        setDateRange(range);
        console.log("Date range:", range);
      },
    },
    {
      label: "Location",
      type: "select" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Local", value: "local" },
        { label: "International", value: "international" },
      ],
      onSelect: (value: string) => console.log("Location filter:", value),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <DataTable
          heading={heading}
          data={orders}
          columns={columns}
          enableSelection
          enableSearch
          filters={filters}
          onSearch={(query) => console.log("Search query:", query)}
          currentPage={ordersResponse?.data.current_page || 1}
          rowsPerPage={ordersResponse?.data.per_page || 10}
          totalItems={ordersResponse?.data.total || 0}
          onPageChange={(page) => setCurrentPage(page)}
          rowActions={rowActions}
        />
      )}
    </div>
  );
}
