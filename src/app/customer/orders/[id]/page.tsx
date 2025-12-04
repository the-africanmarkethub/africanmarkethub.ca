"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useOrderById } from "@/hooks/useOrders";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();
  const orderId = parseInt(params.id as string);
  const { data: orderResponse, isLoading, error } = useOrderById(orderId);

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "processing":
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderResponse?.data?.order) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h3>
          <p className="text-gray-600 mb-4">This order may have been deleted or doesn't exist.</p>
          <Link
            href="/customer/orders"
            className="text-[#F28C0D] hover:text-orange-600 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = orderResponse.data.order;
  const subtotal = order.order_items?.reduce((sum: number, item: any) => sum + parseFloat(item.subtotal || "0"), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header with Back and Help */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Help
        </button>
      </div>

      {/* Order Status and Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}>
              {order.payment_status || "Unknown"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.payment_status === "completed" ? "Delivered" : order.payment_status || "Processing"}</h1>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">Order Arrived at {formatDate(order.created_at)}</p>

        {/* Order Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="font-medium text-gray-900">${order.total} CAD</p>
            <p className="text-sm text-gray-600">Paid with cash</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v2M5 8l2.5 5.5a2 2 0 001.6.8H12" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Shipping Method</p>
            <p className="text-sm text-gray-600">{order.shipping_method || "Express"}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Tracking Number</p>
            <p className="text-sm text-gray-600">{order.tracking_number || "123456"}</p>
          </div>
        </div>

        {/* Additional Order Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Tracking URL</p>
            <p className="text-sm text-gray-600 break-all">{order.tracking_url || "www.dhlexplr.com"}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-5m-6 5h12a1 1 0 001-1V9a1 1 0 00-1-1H7a1 1 0 00-1 1v10a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Payment Date</p>
            <p className="text-sm text-gray-600">{order.payment_date ? formatDate(order.payment_date).split(',')[0] : "22/2/2025"}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Payment Status</p>
            <p className="text-sm text-gray-600 capitalize">{order.payment_status || "Completed"}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-[#F28C0D] mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-5m-6 5h12a1 1 0 001-1V9a1 1 0 00-1-1H7a1 1 0 00-1 1v10a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Delivery Date</p>
            <p className="text-sm text-gray-600">{order.delivery_date ? formatDate(order.delivery_date).split(',')[0] : "24/4/2027"}</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Products</h3>
        <div className="space-y-4">
          {order.order_items && order.order_items.length > 0 ? (
            order.order_items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product?.images?.[0] || "/icon/placeholder.svg"}
                      alt={item.product?.title || "Product"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.product?.title || "Unknown Product"}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Color: {item.product?.variations?.[0]?.color?.name || "Red"}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.price} CAD</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button className="w-8 h-8 rounded-full bg-[#F28C0D] text-white font-medium">1</button>
          <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100">2</button>
          <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100">3</button>
          <button className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Product images */}
          <div className="flex space-x-2">
            {order.order_items?.slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product?.images?.[0] || "/icon/placeholder.svg"}
                  alt={item.product?.title || "Product"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee:</span>
              <span className="font-medium">${order.shipping_fee} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">$0.00 CAD</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">${order.total} CAD</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
            <p className="text-gray-600 capitalize">{order.payment_method?.replace('_', ' ') || "Direct bank transfer"}</p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
            <div className="text-gray-600 space-y-1">
              {order.address ? (
                <>
                  <p className="font-medium text-gray-900">{order.customer?.name} {order.customer?.last_name}</p>
                  <p>{order.address.street_address}, {order.address.city}, {order.address.state} {order.address.zip_code}</p>
                </>
              ) : (
                <p>No address provided</p>
              )}
            </div>
          </div>

          <button className="w-full bg-[#F28C0D] hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6">
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
}