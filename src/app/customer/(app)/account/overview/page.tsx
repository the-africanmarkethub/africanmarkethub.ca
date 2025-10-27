"use client";
import { useGetProfile } from "@/hooks/customer/useGetProfile";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  OrderHistoryTable,
  OrderHistoryRow,
} from "@/components/ui/OrderHistoryTable";
import { useAddress } from "@/hooks/customer/useAddress";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/customer/useOrders";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function AccountOverviewPage() {
  const router = useRouter();

  const { data, isLoading, error } = useGetProfile();
  const user = data?.data;

  const {
    data: addresses,
    // isLoading: isAddressesLoading,
    // error: addressesError,
  } = useAddress();

  // Fetch recent orders (first page only for overview)
  const { data: ordersData, isLoading: ordersLoading } = useOrders(1, 10);

  // Transform and limit orders data for overview (show only 6 items)
  const recentOrders: OrderHistoryRow[] = useMemo(() => {
    if (!ordersData?.data?.data) return [];

    return ordersData.data.data.slice(0, 6).map((order) => {
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
        currency: "CAD",
      };
    });
  }, [ordersData]);

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-100 rounded animate-pulse" />
          <div className="h-6 w-1/4 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-red-500">Failed to load profile.</div>
      ) : user ? (
        <>
          <div>
            <h2 className="text-2xl font-medium mb-4">
              Hello, {user.name} {user.last_name}!
            </h2>
            <p className="text-gray-600">
              From your account dashboard. you can easily check & view your
              Recent Orders, manage your Shipping and Billing Addresses and edit
              your Password and Account Details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-[33px] border border-[#989898] gap-2 flex flex-col justify-center items-center">
              <div className="rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={user.profile_photo}
                  alt="profile"
                  width={120}
                  height={120}
                ></Image>
              </div>
              <div className="text-center">
                <p className="text-[20px] text-[#292929] mb-1 font-medium">
                  {user.name} {user.last_name}
                </p>
                <p className="text-sm text-[#656565] font-normal">Customer</p>
              </div>
              <Link
                className="text-[#F28C0D] text-base leading-[22px] font-medium"
                href={"/account/settings"}
              >
                Edit Profile
              </Link>
            </Card>
            <Card className="py-[33px] border border-[#989898] px-[53px] gap-2.5">
              <div className="text-[#989898] text-sm font-normal">
                Shipping Address
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold">
                  {user.name} {user.last_name}
                </p>
                <p className="text-[#656565] text-sm font-normal">
                  {addresses?.data[0].street_address}, {addresses?.data[0].city}
                  , {addresses?.data[0].country}
                </p>
                <p className="text-base font-normal text-[#292929]">
                  {user.email}
                </p>
                <p className="text-base font-normal text-[#1A1A1A]">
                  {user.phone}
                </p>
              </div>

              <Link
                className="text-[#F28C0D] text-base leading-[22px] font-medium"
                href={"/account/address"}
              >
                Edit Address
              </Link>
            </Card>
          </div>
          <div>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="border rounded-lg overflow-x-auto">
                <OrderHistoryTable
                  data={recentOrders}
                  showAllOrdersLink={true}
                  onSeeAllOrders={() => {
                    router.push("/account/orders");
                  }}
                  onViewDetails={(orderId) => router.push(`/account/orders/${orderId}`)}
                />
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow text-center">
                <h2 className="text-lg font-semibold mb-4">Recent Order History</h2>
                <p className="text-gray-500 mb-4">You have no orders yet.</p>
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>No profile data found.</div>
      )}
    </div>
  );
}
