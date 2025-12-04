"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { useVendorEarnings } from "@/hooks/useVendorEarnings";
import { useVendorOrderStatistics } from "@/hooks/useVendorOrderStatistics";
import { useReviews } from "@/hooks/useReviews";
import { useVendorGraphy } from "@/hooks/useVendorGraphy";
import ProductSlideshow from "@/components/ProductSlideshow";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function VendorDashboard() {
  const [selectedOrderPeriod, setSelectedOrderPeriod] = useState("January");

  // Fetch real data from all APIs
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders(1);
  const { data: earningsData, isLoading: earningsLoading } =
    useVendorEarnings();
  const { data: orderStatsData, isLoading: orderStatsLoading } =
    useVendorOrderStatistics();
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews();
  const { data: graphyData, isLoading: graphyLoading } = useVendorGraphy();

  // Calculate stats from real API data
  const orders = ordersData?.data?.data || [];
  const earnings = earningsData?.data;
  const orderStats = orderStatsData?.data;

  const stats = {
    totalEarnings: earnings ? `${earnings.total_earning}CAD` : "0CAD",
    currentEarnings: earnings ? `${earnings.available_to_withdraw}CAD` : "0CAD",
    pendingEarnings: earnings ? `${earnings.pending}CAD` : "0CAD",
    reviews: reviewsData?.data?.length || 0,
    returns: orderStats?.returned_orders || 0,
    allOrders: orderStats?.total_orders || 0,
    pending: orderStats?.new_orders || 0,
    ongoing: orderStats?.ongoing_orders || 0,
    shipped: orderStats?.shipped_orders || 0,
    cancelled: orderStats?.cancelled_orders || 0,
  };

  // Format real reviews data for display
  const recentReviews = (reviewsData?.data || []).slice(0, 3).map((review) => ({
    id: review.id,
    name: `${review.user.name} ${review.user.last_name}`,
    avatar: review.user.profile_photo,
    rating: review.rating,
    comment: review.comment,
    time: getTimeAgo(review.created_at),
    productName: review.product.title,
  }));

  // Format sales chart data
  const chartData = (graphyData?.data || []).map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short" }),
    sales: parseFloat(point.total),
    displayValue: parseFloat(point.total),
  }));

  // Find peak value for display
  const peakValue = Math.max(...chartData.map((d) => d.sales), 0);

  // Helper function to calculate time ago
  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));

    if (diffInMins < 60) {
      return `${diffInMins} min ago`;
    } else if (diffInMins < 1440) {
      const hours = Math.floor(diffInMins / 60);
      return `${hours} hr ago`;
    } else {
      const days = Math.floor(diffInMins / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <div>
      {/* Dashboard Content */}
      <main className="p-4 lg:p-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
          Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Total Earnings & Current Balance */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-[#F28C0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="flex items-center">
                  <p className="text-xs lg:text-sm font-medium text-gray-600">
                    This Week
                  </p>
                  <svg
                    className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs lg:text-sm text-gray-600 mb-1">
                  Total Earnings
                </p>
                {earningsLoading ? (
                  <div className="h-5 lg:h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-lg lg:text-[20px] font-bold text-gray-900">
                    {stats.totalEarnings}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs lg:text-sm text-gray-600 mb-1">
                  Available to Withdraw
                </p>
                {earningsLoading ? (
                  <div className="h-5 lg:h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-lg lg:text-[20px] font-bold text-gray-900">
                    {stats.currentEarnings}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews & Returns */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex w-full items-center justify-between space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#F28C0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div className="flex">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <svg
                    className="w-4 h-4 text-gray-400 inline ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reviews</p>
                {reviewsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.reviews}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Returns</p>
                {orderStatsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.returns}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between w-full space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#F28C0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <svg
                    className="w-4 h-4 text-gray-400 inline ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">All Orders</p>
                {orderStatsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.allOrders}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                {orderStatsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.pending}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shipped</p>
                {orderStatsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.shipped}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                {orderStatsLoading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-[20px] font-bold text-gray-900">
                    {stats.cancelled}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                Sales Details
              </h2>
              <select
                value={selectedOrderPeriod}
                onChange={(e) => setSelectedOrderPeriod(e.target.value)}
                className="text-xs lg:text-sm border border-gray-300 rounded px-2 lg:px-3 py-1 focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent w-full sm:w-auto"
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
              </select>
            </div>

            {/* Sales Chart */}
            {graphyLoading ? (
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    No sales data available
                  </p>
                  <p className="text-gray-400 text-xs">
                    Start selling to see your sales chart
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F28C0D"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F28C0D"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#F28C0D"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                {peakValue > 0 && (
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-500">
                      Peak: {peakValue.toLocaleString()}CAD
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">
              Recent Review
            </h2>
            <div className="space-y-4">
              {reviewsLoading ? (
                // Skeleton loading for reviews
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, j) => (
                          <div
                            key={j}
                            className="h-3 w-3 bg-gray-200 rounded animate-pulse mr-1"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </div>
                  </div>
                ))
              ) : recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div key={review.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {review.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {review.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {review.time}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Product: {review.productName}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Details Table */}
        <div className="mt-6 lg:mt-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">
              Order Details
            </h2>
            <button className="text-xs lg:text-sm text-[#F28C0D] hover:text-[#8B4513]">
              See All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordersLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : ordersError ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-red-500"
                    >
                      Failed to load orders
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    // Get customer name
                    const customerName = order.customer ? 
                      `${order.customer.name} ${order.customer.last_name}` : "N/A";
                    const customerEmail = order.customer?.email || "";
                    
                    // Calculate total quantity across all items
                    const totalQuantity = order.order_items.reduce(
                      (sum, item) => sum + item.quantity, 0
                    );
                    
                    // Calculate total price
                    const totalPrice = `${order.total}CAD`;
                    
                    // Format date
                    const orderDate = new Date(
                      order.created_at
                    ).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "2-digit",
                    });
                    
                    // Get address
                    const address = order.address?.street_address || 
                                  order.shipping_address?.street || "N/A";

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {customerName}
                            </span>
                            {customerEmail && (
                              <span className="text-xs text-gray-500">{customerEmail}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ProductSlideshow orderItems={order.order_items} showProductNames={true} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {totalQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {orderDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.payment_status === "paid" || order.payment_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.payment_status === "refunded"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.payment_status ? 
                              order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.shipping_status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.shipping_status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.shipping_status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.shipping_status === "cancelled" || order.shipping_status === "returned"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.shipping_status ? 
                              order.shipping_status.charAt(0).toUpperCase() + order.shipping_status.slice(1)
                              : "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
