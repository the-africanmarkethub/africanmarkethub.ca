import { useState } from "react";
import { Badge } from "@/components/vendor/ui/badge";
import TableSkeletonLoader from "@/components/vendor/TableSkeletonLoader";
import { useGetOrders } from "@/hooks/vendor/useGetOrders";
import {
  type RawOrder,
  type OrderWithProductImage,
} from "../order/order-table";
import { OrderItemCarousel } from "../order/OrderItemCarousel";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";

const SimpleOrderTable = ({
  title,
  headerAction,
}: {
  title: string;
  headerAction?: React.ReactNode;
}) => {
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
        // address: i
        shippingStatus:
          (item.shipping_status as
            | "Shipped"
            | "Pending"
            | "Delivered"
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
        paymentStatus: order.payment_status === "paid" ? "Paid" : "Pending",
        status:
          order.shipping_status === "delivered"
            ? "Delivered"
            : order.shipping_status === "cancelled"
              ? "Cancelled"
              : "Pending",
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
    {
      header: "Address",
      accessorKey: "address",
    },
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
              : item.status === "Cancelled"
                ? "destructive"
                : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#DCDCDC] mx-auto pb-5 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 sm:py-8 gap-3 sm:gap-0">
        <h1 className="text-base sm:text-lg/6 leading-[31.92px] font-medium text-gray-900 md:text-[24px] md:leading-[31.92px]">
          {title}
        </h1>
        {headerAction}
      </div>

      {isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          currentPage={ordersResponse?.data.current_page || 1}
          rowsPerPage={ordersResponse?.data.per_page || 10}
          totalItems={ordersResponse?.data.total || 0}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default SimpleOrderTable;
