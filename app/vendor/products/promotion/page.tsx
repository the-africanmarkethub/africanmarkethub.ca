"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVendorDiscounts } from "@/hooks/useVendorDiscounts";
import { useDeleteDiscount } from "@/hooks/useDeleteDiscount";

export default function ProductPromotionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"discount" | "advertising">("discount");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const { data: discountsData, isLoading } = useVendorDiscounts(currentPage, perPage);
  const { mutate: deleteDiscount } = useDeleteDiscount();
  const discounts = discountsData?.data || [];

  useEffect(() => {
    console.log("deleteConfirmId changed to:", deleteConfirmId);
  }, [deleteConfirmId]);

  const handleDelete = (id: number) => {
    console.log("Delete clicked for ID:", id);
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      console.log("Confirming delete for ID:", deleteConfirmId);
      deleteDiscount(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
        },
        onError: (error) => {
          console.error("Delete error:", error);
          setDeleteConfirmId(null);
        }
      });
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/vendor/products/promotion/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit"
    });
  };

  const formatDiscountRate = (rate: string, type: string) => {
    if (type === "percentage") {
      // Convert from basis points to percentage (e.g., 2000 -> 20%)
      return `${(parseInt(rate) / 100).toFixed(0)}%`;
    }
    return `${parseFloat(rate).toFixed(2)}CAD`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Promotion</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("discount")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "discount"
                    ? "text-[#F28C0D] border-[#F28C0D]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Discount & Coupon
              </button>
              <button
                onClick={() => setActiveTab("advertising")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "advertising"
                    ? "text-[#F28C0D] border-[#F28C0D]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Advertising
              </button>
            </div>
          </div>

          {activeTab === "discount" ? (
            <>
              {/* Empty State or List */}
              {discounts.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">There are no open promotions</h3>
                  <Link
                    href="/vendor/products/promotion/add"
                    className="mt-4 px-6 py-3 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Promotional Discount
                  </Link>
                </div>
              ) : (
                <>
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
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

                  {/* Add Button */}
                  <div className="p-4 flex justify-end border-b border-gray-200">
                    <Link
                      href="/vendor/products/promotion/add"
                      className="px-6 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Coupon
                    </Link>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coupon Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expiry
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Limit Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                              Loading discounts...
                            </td>
                          </tr>
                        ) : (
                          discounts.map((discount) => (
                            <tr key={discount.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {discount.product.title || "Easter Promo"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {discount.discount_code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDiscountRate(discount.discount_rate, discount.discount_type)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(discount.start_time)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(discount.end_time)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {discount.product.quantity || 80}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => handleEdit(discount.id)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(discount.id)}
                                    className="text-gray-600 hover:text-red-600"
                                  >
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
                  {discounts.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          1-{Math.min(perPage, discounts.length)} of {discounts.length} Row/Page:
                          <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="ml-2 px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="7">7/12</option>
                            <option value="10">10/12</option>
                            <option value="12">12/12</option>
                            <option value="20">20/12</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          {Array.from({ length: Math.min(6, Math.ceil(discounts.length / perPage)) }, (_, i) => i + 1).map((page) => (
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
                </>
              )}
            </>
          ) : (
            // Advertising Tab Content
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No advertising campaigns yet</h3>
              <p className="text-gray-500">Start promoting your products to reach more customers</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && deleteConfirmId !== undefined && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this discount? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}