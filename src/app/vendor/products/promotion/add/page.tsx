"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateDiscount } from "@/hooks/useCreateDiscount";
import { useVendorProducts } from "@/hooks/useVendorProducts";

export default function AddCouponPage() {
  const router = useRouter();
  const { mutate: createDiscount, isPending } = useCreateDiscount();
  const { data: productsData } = useVendorProducts(1, 100); // Get all products
  const products = productsData?.data?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    discount_code: "",
    discount_rate: "",
    discount_type: "percentage" as "percentage" | "fixed",
    limit_number: "",
    start_time: "",
    end_time: "",
    product_id: "",
    notify_users: false,
    status: "active" as "active" | "deactivate",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.discount_code || !formData.discount_rate || !formData.start_time || !formData.end_time || !formData.product_id) {
      alert("Please fill in all required fields");
      return;
    }

    // Convert discount rate based on type
    let discountRate = parseFloat(formData.discount_rate);
    if (formData.discount_type === "percentage") {
      // Convert percentage to basis points (e.g., 20% -> 2000)
      discountRate = discountRate * 100;
    }

    // Format datetime for API (YYYY-MM-DD HH:mm:ss)
    const formatDateTime = (dateTime: string) => {
      const date = new Date(dateTime);
      return date.toISOString().replace('T', ' ').slice(0, 19);
    };

    const submitData = {
      product_id: formData.product_id,
      start_time: formatDateTime(formData.start_time),
      end_time: formatDateTime(formData.end_time),
      discount_rate: discountRate,
      notify_users: formData.notify_users,
      status: formData.status,
      discount_type: formData.discount_type,
      discount_code: formData.discount_code,
    };

    createDiscount(submitData, {
      onSuccess: () => {
        router.push("/vendor/products/promotion");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/vendor/products/promotion"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add Coupon</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Coupon Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Title
            </label>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
            />
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              placeholder="Code"
              value={formData.discount_code}
              onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              required
            />
          </div>

          {/* Discount Type and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as "percentage" | "fixed" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                placeholder={formData.discount_type === "percentage" ? "Enter percentage" : "Amount"}
                value={formData.discount_rate}
                onChange={(e) => setFormData({ ...formData, discount_rate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                required
                step={formData.discount_type === "percentage" ? "1" : "0.01"}
                min="0"
              />
            </div>
          </div>

          {/* Limit Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limit Number (Optional)
            </label>
            <input
              type="number"
              placeholder="Limit"
              value={formData.limit_number}
              onChange={(e) => setFormData({ ...formData, limit_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              min="0"
            />
          </div>

          {/* Active Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Active Date *
            </label>
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              required
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              required
            />
          </div>

          {/* Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product *
            </label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title} - {product.sku}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "deactivate" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="deactivate">Deactivate</option>
            </select>
          </div>

          {/* Notify Users */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notify_users"
              checked={formData.notify_users}
              onChange={(e) => setFormData({ ...formData, notify_users: e.target.checked })}
              className="h-4 w-4 text-[#F28C0D] focus:ring-[#F28C0D] border-gray-300 rounded"
            />
            <label htmlFor="notify_users" className="ml-2 text-sm text-gray-700">
              Notify users about this promotion
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Link
              href="/vendor/products/promotion"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}