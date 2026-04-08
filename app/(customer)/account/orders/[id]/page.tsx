"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { formatAmount } from "@/utils/formatCurrency";
import { User } from "@/interfaces/user";
import { Order, OrderItem as OrderItemType } from "@/interfaces/orders";
import Address from "@/interfaces/address";
import { getOrderDetail } from "@/lib/api/orders";
import { formatHumanReadableDate } from "@/utils/formatDate";

import { useRouter } from 'next/navigation';
import Link from "next/link";
interface OrderDetailResponse {
  status: string;
  message: string;
  data: {
    order: Order; // Use the corrected Order type
    total_orders: number;
    total_amount: string;
    total_cancelled: number;
    total_delivered: number;
  };
}

function CustomerSummary({
  customer,
  address,
}: {
  customer: User;
  address: Address;
}) {
  if (!customer || !address) return null;

  return (
    <div className="p-6 text-sm text-gray-700 bg-white border border-gray-200 shadow-lg rounded-xl">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-2 md:pr-6">
          <p className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Delivery Shipping Address
          </p>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="font-medium text-gray-700">
              {customer.name} {customer.last_name}
            </p>
            <p className="text-gray-600">
              {[
                address.street_address,
                address.city,
                address.state,
                address.zip_code,
                address.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="mt-1 text-gray-600">
              <span className="font-medium">Phone:</span>{" "}
              {address.phone ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderItemsTable({ order }: { order: Order }) {
  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Order Items ({order.order_items.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead>
            <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              <th className="px-2 py-3">Product</th>
              <th className="px-2 py-3">SKU</th>
              <th className="px-2 py-3 text-right">Unit Price</th>
              <th className="px-2 py-3 text-right">Qty</th>
              <th className="px-2 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td className="px-2 py-4">
                  <Link
                    href={`/items/${item.product.slug}`}
                    className="flex items-center px-2 -mx-2 transition duration-150 rounded-lg hover:bg-gray-50"
                  >
                    <Image
                      src={item.product.images[0] || "/placeholder.png"}
                      alt={item.product.title}
                      width={40}
                      height={40}
                      className="object-cover w-10 h-10 mr-3 rounded"
                    />
                    <span className="font-medium text-gray-700 truncate">
                      {item.product.title}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-4 text-gray-500 truncate">
                  {item.product.sku}
                </td>
                <td className="px-2 py-4 text-right">
                  {formatAmount(parseFloat(item.price))}
                </td>
                <td className="px-2 py-4 text-right">{item.quantity}</td>
                <td className="px-2 py-4 font-semibold text-right">
                  {formatAmount(parseFloat(item.subtotal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-full max-w-xs space-y-2 text-gray-700">
          <div className="flex justify-between font-medium">
            <span>Total Items Subtotal:</span>
            <span>
              {formatAmount(
                order.order_items.reduce(
                  (sum, item) => sum + parseFloat(item.subtotal),
                  0
                )
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Fee ({order.shipping_method}):</span>
            <span>{formatAmount(parseFloat(order.shipping_fee))}</span>
          </div>
          <div className="flex justify-between pt-2 text-lg font-bold text-red-700 border-t border-gray-300">
            <span>Order Total:</span>
            <span>{formatAmount(parseFloat(order.total))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const params = useParams();
  const orderId = params?.id as string | undefined;

  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const response = (await getOrderDetail(orderId)) as OrderDetailResponse;

        setOrderDetail(response.data.order);
      } catch (err) {
        console.error("Failed to load order detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading || !orderDetail) {
    if (!loading && !orderDetail)
      return (
        <div className="p-6 text-center text-red-500">Order Not Found.</div>
      );
    return <Skeleton count={10} className="p-4" />;
  }

  const orderMeta = orderDetail;
  const customer = orderDetail.customer;
  const address = orderDetail.address;

  const router = useRouter();

  const handleTrackClick = () => {
    // 2. Use router.push() for a clean, client-side navigation
    router.push('/account/tracking');
  };
  return (
    <div className="p-0 space-y-4 text-gray-600">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 shadow-sm md:flex-row md:items-center md:justify-between rounded-xl">
        {/* Left: title */}
        <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
          Order Details - #{orderMeta.id}
        </h1>

        {/* Right: buttons — stays on one line on md+ */}
        <div className="flex items-center space-x-3 flex-nowrap">

          {orderMeta.shipping_status === "ongoing" && (
            <> 
              <button onClick={handleTrackClick} className="btn btn-primary min-w-22.5 text-xs!">
                Track Order
              </button>
            </>
          )}
          {orderMeta.shipping_status === "delivered" && (
            <> 
              <button onClick={handleTrackClick} className="btn btn-primary min-w-22.5 text-xs!">
                Order Completed
              </button>
            </>
          )}
        </div>
      </div>

      <CustomerSummary customer={customer} address={address} />
      <OrderItemsTable order={orderDetail} />

      <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
        <h3 className="pb-2 mb-4 text-xl font-semibold text-gray-800 border-b border-gray-200">
          📦 Shipping & Payment Details
        </h3>

        <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-2">
          {/* 1. Shipping Details Group */}
          <div className="pr-4 space-y-3 border-r border-gray-200 md:border-r">
            <h4 className="mb-2 text-base font-bold text-gray-900">
              Shipping Info
            </h4>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">
                Shipping Method:
              </p>
              {/* Assuming shipping_method is available on orderMeta */}
              <p className="w-1/2 font-semibold text-right text-gray-800">
                {orderMeta.shipping_method ?? "N/A"}
              </p>
            </div>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">
                Tracking Detail:
              </p>
              <p className="w-1/2 text-right text-gray-800">
                {orderMeta.tracking_url ? (
                  <a
                    href={orderMeta.tracking_url}
                    rel="noopener noreferrer"
                    className="block max-w-full text-red-600 underline truncate"
                    title={orderMeta.tracking_url}
                  >
                    {orderMeta.tracking_url}
                  </a>
                ) : (
                  orderMeta.tracking_number
                )}
              </p>
            </div>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">
                Estimated Delivery:
              </p>
              <p className="w-1/2 text-right text-gray-800">
                {orderMeta.delivery_date
                  ? formatHumanReadableDate(orderMeta.delivery_date)
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* 2. Payment & Settlement Group */}
          <div className="pl-4 space-y-3">
            <h4 className="mb-2 text-base font-bold text-gray-900">
              Payment Info
            </h4>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">Payment Method:</p>
              <p className="w-1/2 text-right text-gray-800">
                {orderMeta.payment_method.toUpperCase()}
              </p>
            </div>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">Payment Status:</p>
              {/* Using the payment_status from the Order object for accuracy */}
              <p
                className={`font-semibold w-1/2 text-right ${orderMeta.payment_status === "completed"
                    ? "text-hub-secondary"
                    : "text-red-700"
                  }`}
              >
                {orderMeta.payment_status.toUpperCase()}
              </p>
            </div>

            <div className="flex items-start justify-between">
              <p className="w-1/2 font-medium text-gray-600">Shipping Date:</p>
              <p className={`font-semibold w-1/2 text-right`}>
                {formatHumanReadableDate(orderMeta?.shipping_date || "")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
