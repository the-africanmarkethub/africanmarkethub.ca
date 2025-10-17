"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useOrder, useCancelOrder } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data, isLoading, isError } = useOrder(orderId);
  const cancelOrderMutation = useCancelOrder();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Use API data - cast as any to handle type differences
  const order = data?.data?.order as any;
  const products = order?.order_items || [];
  const address = data?.data?.order?.address;

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }
  // Map shipping_status to display status
  const getDisplayStatus = (shippingStatus: string) => {
    if (shippingStatus === "delivered") return "Delivered";
    if (shippingStatus === "cancelled") return "Cancelled";
    return "Shipping";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(orderId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Failed to load order details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full flex-col md:flex-row gap-8">
        {/* Order Details Card */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold">
                  Order {getDisplayStatus(order.shipping_status)}
                </span>
                <Badge
                  variant="outline"
                  className={`${
                    getDisplayStatus(order.shipping_status) === "Delivered"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : getDisplayStatus(order.shipping_status) === "Cancelled"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {getDisplayStatus(order.shipping_status)}
                </Badge>
              </div>
              <div className="text-gray-500 text-sm mb-1">
                {getDisplayStatus(order.shipping_status) === "Delivered"
                  ? `Order Arrived at ${order.delivery_date || formatDate(order.created_at)}`
                  : `Order placed on ${formatDate(order.created_at)}`}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="bg-white rounded-xl border p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-1">
                {parseFloat(order.total).toLocaleString()} NGN
              </div>
              <div className="text-gray-500">
                {order.payment_status || "Pending"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Product</div>
              <div className="text-gray-500">{products.length}x</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Shipping Method</div>
              <div className="text-gray-500">
                {order.shipping_method || "Standard"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Shipping Fee</div>
              <div className="text-gray-500">
                {parseFloat(order.shipping_fee || "0").toLocaleString()} NGN
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Tracking Number</div>
              <div className="text-gray-500">
                {order.tracking_number || "N/A"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Tracking URL</div>
              <div className="text-primary underline cursor-pointer">
                {order.tracking_url || "N/A"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Payment Date</div>
              <div className="text-gray-500">
                {order.payment_date ? formatDate(order.payment_date) : "N/A"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Payment Status</div>
              <div className="text-gray-500">
                {order.payment_status || "Pending"}
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Delivery Date</div>
              <div className="text-gray-500">
                {order.delivery_date
                  ? formatDate(order.delivery_date)
                  : "Pending"}
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Products</h3>
            <div className="divide-y">
              {paginatedProducts.map((product: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Image
                    src={
                      product.product?.images?.[0] ||
                      product.product_image ||
                      product.image ||
                      "/assets/default.png"
                    }
                    alt={
                      product.product?.title ||
                      product.product_name ||
                      product.name ||
                      "Product"
                    }
                    width={56}
                    height={56}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {product.product?.title ||
                        product.product_name ||
                        product.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.variation_details?.color && (
                        <>
                          <span className="font-semibold">Color:</span>{" "}
                          {product.variation_details.color}{" "}
                        </>
                      )}
                      {product.variation_details?.size && (
                        <>
                          <span className="font-semibold ml-4">Size:</span>{" "}
                          {product.variation_details.size}{" "}
                        </>
                      )}
                      <span className="font-semibold ml-4">Quantity:</span>{" "}
                      {product.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-base whitespace-nowrap">
                    {product.subtotal || product.total || product.price}{" "}
                    {(order as any).currency || "NGN"}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination for products */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium mx-1 ${
                        page === currentPage
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="w-[421px] flex flex-col gap-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="text-gray-500">Order ID:</span>
              <span className="text-primary font-semibold">#{order.id}</span>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>
                  {(
                    parseFloat(order.total || "0") -
                    parseFloat(order.shipping_fee || "0")
                  ).toLocaleString()}{" "}
                  NGN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Fee:</span>
                <span>
                  {parseFloat(order.shipping_fee || "0").toLocaleString()} NGN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax:</span>
                <span>0 NGN</span>
              </div>
              <div className="flex justify-between font-semibold text-base mt-2">
                <span>Total</span>
                <span>
                  {parseFloat(order.total || "0").toLocaleString()} NGN
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="text-base font-medium text-gray-700">
              {order.payment_method || "Card"}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="text-base font-medium text-gray-700">
                {address ? (
                  <div>
                    <div>{address.street_address}</div>
                    <div>
                      {address.city}, {address.state} {address.zip_code}
                    </div>
                    <div>{address.country}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Phone: {address.phone}
                    </div>
                  </div>
                ) : (
                  `Address ID: ${order.address_id}`
                )}
              </div>
            </div>
            <button className="text-primary font-semibold ml-4">&gt;</button>
          </div>
        </div>
      </div>

      {/* Reorder Section */}
      <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row items-center justify-between mt-8">
        <div className="flex -space-x-4 mb-4 md:mb-0">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Image
                key={i}
                src="/img/African Market Hub Banner.png"
                alt="product"
                width={56}
                height={56}
                className="rounded-full border-2 border-white"
              />
            ))}
        </div>
        <div className="flex items-center gap-8 w-full md:w-auto justify-between">
          <span className="text-2xl font-bold">
            {parseFloat(order.total || "0").toLocaleString()} NGN
          </span>
          {order.shipping_status === "processing" ||
          order.shipping_status === "pending" ? (
            <Button
              className="rounded-full px-8 py-3 text-lg font-semibold bg-red-500 hover:bg-red-600"
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
            >
              {cancelOrderMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Cancel Order"
              )}
            </Button>
          ) : (
            <Button className="rounded-full px-8 py-3 text-lg font-semibold">
              Reorder
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
