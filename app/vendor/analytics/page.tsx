"use client";

import { useState } from "react";
import { useVendorSalesAnalytics } from "@/hooks/useVendorSalesAnalytics";
import { useVendorTopCategories } from "@/hooks/useVendorTopCategories";
import { useVendorTopProducts } from "@/hooks/useVendorTopProducts";
import { useVendorTopCustomerLocations } from "@/hooks/useVendorTopCustomerLocations";
import { useOrders } from "@/hooks/useOrders";

export default function AnalyticsReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [selectedLocation, setSelectedLocation] = useState("This Week");
  const [selectedPage, setSelectedPage] = useState("This Week");

  const { data: analyticsData, isLoading: analyticsLoading } =
    useVendorSalesAnalytics();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useVendorTopCategories();
  const { data: productsData, isLoading: productsLoading } =
    useVendorTopProducts();
  const { data: locationsData, isLoading: locationsLoading } =
    useVendorTopCustomerLocations();
  const { data: ordersData, isLoading: ordersLoading } = useOrders(1);

  const analytics = analyticsData?.data;
  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];
  const customerLocations = locationsData?.data || [];
  const orders = ordersData?.data?.data || [];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + "k";
    }
    return amount.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2);
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid") return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getShippingStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "delivered") return "bg-green-100 text-green-700";
    if (statusLower === "shipped" || statusLower === "shipping")
      return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // Mock data for most visited pages (replace with actual API when available)
  const pageVisits = [
    { page: "Top Deals", visits: 547914, percentage: 81.84 },
    { page: "Fashion", visits: 547914, percentage: 81.84 },
    { page: "Electronics", visits: 547914, percentage: 81.84 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Sales Analytics
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sales Volume Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Sales Volume</p>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analyticsLoading
                ? "..."
                : formatCurrency(analytics?.sales_volume || 0)}
            </p>
            <p
              className={`text-sm flex items-center ${
                (analytics?.sales_growth || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    (analytics?.sales_growth || 0) >= 0
                      ? "M5 10l7-7m0 0l7 7m-7-7v18"
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                />
              </svg>
              {formatPercentage(analytics?.sales_growth || 0)}%{" "}
              {(analytics?.sales_growth || 0) >= 0 ? "Increase" : "Decrease"}
            </p>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <div className="p-2 bg-orange-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analyticsLoading
                ? "..."
                : `${formatPercentage(analytics?.conversion_rate || 0)}%`}
            </p>
            <p
              className={`text-sm flex items-center ${
                (analytics?.conversion_growth || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    (analytics?.conversion_growth || 0) >= 0
                      ? "M5 10l7-7m0 0l7 7m-7-7v18"
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                />
              </svg>
              {formatPercentage(analytics?.conversion_growth || 0)}%{" "}
              {(analytics?.conversion_growth || 0) >= 0
                ? "Increase"
                : "Decrease"}
            </p>
          </div>

          {/* Profit Margins Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Profit Margins</p>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {analyticsLoading
                ? "..."
                : `${formatPercentage(analytics?.profit_margin || 0)}%`}
            </p>
            <p
              className={`text-sm flex items-center ${
                (analytics?.profit_growth || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    (analytics?.profit_growth || 0) >= 0
                      ? "M5 10l7-7m0 0l7 7m-7-7v18"
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                />
              </svg>
              {formatPercentage(analytics?.profit_growth || 0)}%{" "}
              {(analytics?.profit_growth || 0) >= 0 ? "Increase" : "Decrease"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Category Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Category
              </h2>
              <p className="text-sm text-gray-500">
                Top Category In This Month
              </p>
            </div>
            <div className="space-y-3">
              {categoriesLoading ? (
                <div className="text-center text-gray-500 py-4">
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No category data available
                </div>
              ) : (
                categories.slice(0, 8).map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        {category.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {category.quantity_sold}
                      </span>
                      <span
                        className={`text-xs ${
                          index < 3 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {index < 3 ? "-5%" : "+5%"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Product Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Product
              </h2>
              <p className="text-sm text-gray-500">Top Product In This Month</p>
            </div>
            <div className="space-y-3">
              {productsLoading ? (
                <div className="text-center text-gray-500 py-4">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No product data available
                </div>
              ) : (
                products.slice(0, 7).map((product, index) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sold: {product.quantity_sold}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}CAD
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Location and Most Visited Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Location */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                User Location
              </h2>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                {selectedLocation}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* World Map Placeholder */}
            <div className="h-48 bg-blue-50 rounded-lg mb-6 flex items-center justify-center">
              <svg
                className="w-full h-full p-4 text-blue-200"
                viewBox="0 0 800 400"
                fill="currentColor"
              >
                <path
                  d="M100,200 Q200,100 300,200 T500,200 Q600,100 700,200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="200" cy="150" r="5" />
                <circle cx="400" cy="200" r="5" />
                <circle cx="600" cy="180" r="5" />
              </svg>
            </div>

            {/* Country Statistics */}
            <div className="space-y-3">
              {locationsLoading ? (
                <div className="text-center text-gray-500 py-4">
                  Loading locations...
                </div>
              ) : customerLocations.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No location data available
                </div>
              ) : (
                customerLocations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-4 bg-gray-200 rounded"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {location.country}{" "}
                          {location.city ? `(${location.city})` : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {location.percentage}% •{" "}
                          {location.total_customers.toLocaleString()} Customer
                          {location.total_customers !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Most Visited Page */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Most Visited Page
              </h2>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                {selectedPage}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Donut Chart */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#E5E7EB"
                    strokeWidth="24"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#3B82F6"
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray="452"
                    strokeDashoffset="113"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="72"
                    stroke="#F59E0B"
                    strokeWidth="24"
                    fill="none"
                    strokeDasharray="452"
                    strokeDashoffset="339"
                  />
                </svg>
              </div>
            </div>

            {/* Page Statistics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">PAGE NAME</span>
                <span className="text-gray-500">TOTAL USERS</span>
                <span className="text-gray-500">BOUNCE RATE</span>
              </div>
              {pageVisits.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-700">{page.page}</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {page.visits.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-900">
                    {page.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Latest Order
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordersLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading orders...
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
                  orders.slice(0, 9).map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                            <svg
                              className="w-8 h-8 text-gray-400 p-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-900">
                            {order.customer?.name || "Miles"},{" "}
                            {order.customer?.last_name || "Esther"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.order_items?.[0]?.product?.title ||
                          "Beigi Coffe (Navy)"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {parseFloat(order.total).toFixed(2)}CAD
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.order_items?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ) || 2}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.address?.street_address || "3605 Parker Rd."}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${getPaymentStatusBadge(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status || "Paid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${getShippingStatusBadge(
                            order.shipping_status
                          )}`}
                        >
                          {order.shipping_status || "Shipping"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
