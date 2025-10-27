"use client";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/vendor/dashboard/DashboardHeader";
import { StatsCard } from "@/components/vendor/dashboard/StatsCard";
import { RecentReview } from "@/components/vendor/dashboard/recent-review";
import { useGetWalletBalance } from "@/hooks/vendor/useGetWalletBalance";
import { useGetReviews } from "@/hooks/vendor/useReview";
import { useGetOrderStats } from "@/hooks/vendor/useGetOrderStats";
import { type Review } from "@/components/vendor/dashboard/recent-review";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/vendor/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import SimpleOrderTable from "@/components/vendor/dashboard/simple-order-table";
import SalesDetailsChart from "@/components/vendor/dashboard/sales-details-chart";

export default function DashboardPage() {
  const { data: walletData } = useGetWalletBalance();
  const { data: reviewData } = useGetReviews();
  const { data: orderStatsData } = useGetOrderStats();

  const totalEarningsStats = {
    icon: "/assets/icons/coinstack.svg",
    items: [
      {
        label: "Total Earnings",
        value: `${walletData?.data?.total_earning ?? 0}CAD`,
      },
      {
        label: "Current Balance",
        value: `${walletData?.data?.available_to_withdraw ?? 0}CAD`,
      },
    ],
  };

  const reviews = {
    icon: "/assets/icons/filetext.svg",
    items: [
      { label: "Reviews", value: `${reviewData?.data?.length ?? 0}` },
      { label: "Returns", value: 4 },
    ],
  };

  const allOrdersStats = {
    icon: "/assets/icons/shoppingbag.svg",
    items: [
      { label: "All Orders", value: orderStatsData?.data?.total_orders ?? 0 },
      { label: "Pending", value: orderStatsData?.data?.ongoing_orders ?? 0 },
      {
        label: "Completed",
        value: orderStatsData?.data?.completed_orders ?? 0,
      },
      {
        label: "Cancelled",
        value: orderStatsData?.data?.cancelled_orders ?? 0,
      },
    ],
  };
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 sm:space-y-6 md:space-y-8">
      <DashboardHeader />

      <div className="grid gap-4 grid-cols-1 sm:gap-6 sm:grid-cols-2 xl:grid-cols-[3fr_2.5fr_4fr]">
        <StatsCard {...totalEarningsStats} />
        <StatsCard {...reviews} />
        <StatsCard {...allOrdersStats} center />
      </div>

      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 xl:grid-cols-12">
        <Card className="col-span-full bg-white border rounded-2xl xl:col-span-8 overflow-hidden">
          <SalesDetailsChart />
        </Card>
        <Card className="w-full bg-white col-span-full border rounded-2xl xl:col-span-4 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg/6 text-[#45464E] pb-2 border-b md:text-xl">
              Recent Review
            </h3>
            <div className="mt-2">
              {reviewData?.data?.map((review: Review) => (
                <RecentReview key={review.id} {...review} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <SimpleOrderTable
          title="Order Details"
          headerAction={
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="border border-[#EEEEEE]">
                <Button
                  variant="ghost"
                  className="font-medium rounded-sm text-xs text-[#292929]"
                >
                  See All
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem>View All Orders</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Filter Orders</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      </div>
    </div>
  );
}
