"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetSingleOrder } from "@/hooks/vendor/useGetSingleOrder";
import { formatDateTime } from "@/utils/utils";
import OrderItems from "@/components/vendor/order/order-items";
import CustomerInfo from "@/components/vendor/order/customer-info";
import { type Customer } from "@/components/vendor/order/customer-info";
import TableSkeletonLoader from "@/components/vendor/TableSkeletonLoader";
// import {
//   type OrderItem,
//   type OrderSummary,
// } from "@/components/order/order-items";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const [orderId, setOrderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then(({ orderId }) => setOrderId(orderId));
  }, [params]);

  const { data, isLoading, error } = useGetSingleOrder(orderId ? Number(orderId) : 0);
  const orderDetail = data?.data?.order;

  if (!orderId || isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:space-y-8 md:p-8">
        <TableSkeletonLoader />
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div className="flex-1 space-y-6 p-6 md:space-y-8 md:p-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">Error Loading Order</h2>
          <p className="text-gray-600">Could not load order details. Please try again.</p>
        </div>
      </div>
    );
  }

  const { dateOnly: membershipDate } = formatDateTime(
    orderDetail?.customer?.created_at
  );

  const { dateTime: order_created_at } = formatDateTime(
    orderDetail?.created_at
  );

  const customer: Customer = {
    profile_photo: orderDetail?.customer.profile_photo || "",
    name: orderDetail?.customer?.name || "",
    last_name: orderDetail?.customer?.last_name || "",
    email: orderDetail?.customer?.email || "",
    phone: orderDetail?.customer?.phone || "",
    created_at: membershipDate || "",
    address: orderDetail?.address || "N/A",
    totalOrders: data?.data?.total_orders || 0,
    completedOrders: data?.data.total_delivered || 0,
    cancelledOrders: data?.data.total_cancelled || 0,
    order_created_at: order_created_at || "",
  };

  // const summary: OrderSummary = {
  //   orderItems:
  //     orderDetail?.order_items?.map((item: OrderItem) => ({
  //       id: item.id,
  //       productName: item.product.title || "",
  //       productImg: item.product.images[0] || "",
  //       qty: item.quantity || 0,
  //       price: item.price || "0",
  //       discount: 40000,
  //       shipping_status: "shipping",
  //     })) || [],
  //   shippingFee: orderDetail.shipping_fee,
  //   total: orderDetail.total,
  // };

  return (
    <div className="flex-1 space-y-6 p-6 md:space-y-8 md:p-8">
      <div className="flex flex-col items-start gap-y-2 justify-between md:flex-row md:items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-x-2">
            <ArrowLeft className="w-6 h-6 md:hidden" />
            <h1 className="text-[16px] leading-[22px] font-medium md:text-2xl md:font-semibold">
              Order Details - {orderDetail.id}
            </h1>
          </div>
          <div className="flex items-center gap-x-2 justify-end md:hidden">
            <Badge 
              className="px-3" 
              variant={
                orderDetail.payment_status === 'paid' ? 'default' : 
                orderDetail.payment_status === 'failed' ? 'destructive' : 'secondary'
              }
            >
              {orderDetail.payment_status === 'paid' ? 'Paid' : 
               orderDetail.payment_status === 'failed' ? 'Failed' : 'Pending'}
            </Badge>
            <Badge 
              className="px-3" 
              variant={
                orderDetail.shipping_status === 'delivered' ? 'default' :
                orderDetail.shipping_status === 'cancelled' ? 'destructive' : 'secondary'
              }
            >
              {orderDetail.shipping_status === 'delivered' ? 'Delivered' :
               orderDetail.shipping_status === 'cancelled' ? 'Cancelled' :
               orderDetail.shipping_status === 'shipped' ? 'Shipped' : 'Pending'}
            </Badge>
          </div>
        </div>
        <p className="font-normal text-sm text-[#989898] md:hidden">
          {customer?.order_created_at}
        </p>
        <div className="flex gap-x-4 mt-2 md:mt-0">
          <Button
            variant="outline"
            className="rounded-full font-semibold bg-[#FFFFFF] px-6 border border-[#9C5432]"
          >
            Cancel Order
          </Button>
          <Button className="flex font-semibold rounded-full text-[#FFFFFF] px-6 items-center gap-2">
            <Download className="w-5 h-5 md:h-6 md:w-6" />
            Download
          </Button>
        </div>
      </div>

      <CustomerInfo {...customer} />
      <OrderItems orderData={orderDetail} />

      {/* Order Notes */}
      <div className="hidden bg-[#FFFFFF] rounded-2xl py-[32px] px-[28px] border-none md:block">
        <h2 className="text-xlleading-[32px] font-semibold mb-4">
          Order Notes
        </h2>
        <Card className="border-none">
          <p className="text-base font-normal text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Card>
      </div>
    </div>
  );
}
