"use client";

import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthGuard();
  const { data: ordersResponse, isLoading, error } = useOrders();

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const orders = ordersResponse?.data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Order History</h2>
        {ordersResponse?.data && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{ordersResponse.data.total_orders}</span> orders • 
            <span className="font-medium"> ${ordersResponse.data.total_amount_spent}</span> total spent
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-[#F28C0D] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="py-4 px-4 text-gray-600">{formatDate(order.created_at)}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-4 text-gray-600">${order.total} CAD</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status || "Unknown"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="text-[#F28C0D] hover:text-orange-600 font-medium transition-colors mr-4"
                    >
                      View Details
                    </Link>
                    {(order.payment_status?.toLowerCase() === "completed" || order.payment_status?.toLowerCase() === "paid") && (
                      <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                        Reorder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
