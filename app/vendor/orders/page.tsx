"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useVendorOrderStatistics } from "@/hooks/useVendorOrderStatistics";
import ProductSlideshow from "@/components/ProductSlideshow";
import OrderDetailsModal from "@/components/OrderDetailsModal";

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { data: ordersData, isLoading: ordersLoading } = useOrders(currentPage);
  const { data: statsData, isLoading: statsLoading } = useVendorOrderStatistics();
  
  const orders = ordersData?.data?.data || [];
  const stats = statsData?.data;

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
    if (statusLower === "shipped" || statusLower === "shipping") return "bg-blue-100 text-blue-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit"
    });
  };

  const formatPrice = (price: number | string) => {
    return parseFloat(price.toString()).toLocaleString();
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <span className="text-sm font-medium">This Week</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">All Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_orders ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.cancelled_orders ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Ongoing</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.ongoing_orders ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.shipped_orders ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Right Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <span className="text-sm font-medium">This Week</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.shipped_orders ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.cancelled_orders ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Returned</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.returned_orders ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Order Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Latest Order</h2>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              >
                <option value="all">Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              >
                <option value="all">Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              >
                <option value="all">Location</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordersLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {order.customer?.name || "Miles"}, {order.customer?.last_name || "Esther"}
                      </td>
                      <td className="px-6 py-4">
                        <ProductSlideshow 
                          orderItems={order.order_items} 
                          showProductNames={false}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatPrice(order.total || 105.12)}CAD
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {order.order_items?.length || 2}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.address?.street_address || "3605 Parker Rd."}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${getPaymentStatusBadge(order.payment_status || "Pending")}`}>
                          {order.payment_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${getShippingStatusBadge(order.shipping_status || "Pending")}`}>
                          {order.shipping_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-red-600" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  1-20 of 300 Row/Page: 
                  <select className="ml-2 px-2 py-1 border border-gray-300 rounded">
                    <option value="7">7/12</option>
                    <option value="10">10/12</option>
                    <option value="20">20/12</option>
                  </select>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-[#F28C0D] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <span className="px-2">...</span>
                  <button className="px-3 py-1 rounded hover:bg-gray-100">16</button>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}