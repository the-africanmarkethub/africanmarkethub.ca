import React from "react";

export type OrderStatus = "Shipping" | "Delivered" | "Cancelled";

export interface OrderHistoryRow {
  id: string | number;
  date: string;
  total: string;
  products: number;
  status: OrderStatus;
  currency?: string;
}

export interface OrderHistoryTableProps {
  data: OrderHistoryRow[];
  onViewDetails?: (orderId: string | number) => void;
  showAllOrdersLink?: boolean;
  onSeeAllOrders?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const statusStyles: Record<OrderStatus, string> = {
  Shipping: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function OrderHistoryTable({
  data,
  onViewDetails,
  showAllOrdersLink = false,
  onSeeAllOrders,
  pagination,
}: OrderHistoryTableProps) {
  return (
    <>
      <div className="bg-white p-8 rounded-3xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recet Order History</h2>
          {showAllOrdersLink && (
            <button
              className="text-primary font-medium hover:underline text-right"
              onClick={onSeeAllOrders}
            >
              See all orders
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[18%]" />
              <col className="w-[30%]" />
              <col className="w-[15%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead className="bg-[#EEEEEE] text-[#4D4D4D] font-semibold">
              <tr>
                <th className="px-4 py-3 text-left text-gray-500 whitespace-nowrap">Order ID</th>
                <th className="px-4 py-3 text-left text-gray-500 whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left text-gray-500 whitespace-nowrap">Total</th>
                <th className="px-4 py-3 text-left text-gray-500 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-700 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-4 text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-medium whitespace-nowrap">
                        {order.total} {order.currency || "CAD"}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        ({order.products} Product{order.products > 1 ? "s" : ""})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded px-3 py-1 border text-xs font-medium whitespace-nowrap ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      className="text-primary font-medium hover:underline whitespace-nowrap transition-colors hover:text-primary/80"
                      onClick={() => onViewDetails?.(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            &lt;
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => pagination.onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium mx-1 ${
                  page === pagination.currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}
