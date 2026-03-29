import React from "react";
import { FaCheckCircle, FaBox, FaTruck, FaHome } from "react-icons/fa";
import { clsx } from "clsx";
import { Order, ShippingStatus } from "@/interfaces/orders";

interface OrderStatusTrackerProps {
  order: Order;
}

const statusSteps: { id: ShippingStatus; label: string; icon: any }[] = [
  { id: "pending", label: "Ordered", icon: FaCheckCircle },
  { id: "processing", label: "Preparing", icon: FaBox },
  { id: "ongoing", label: "Shipped", icon: FaTruck },
  { id: "delivered", label: "Delivered", icon: FaHome },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order }) => {
  const shipping = order.shipping_details?.[0];
  const currentStatus = shipping?.status || "pending";

  const currentStatusIndex = statusSteps.findIndex((step) => step.id === currentStatus);

  return (
    <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-start justify-between gap-2 pb-4 border-b sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.updated_at).toLocaleDateString()}
          </p>
        </div>
        {shipping?.carrier && (
          <div className="text-right">
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Carrier</p>
            <p className="text-sm font-medium text-gray-700">{shipping.carrier}</p>
          </div>
        )}
      </div>

      <div className="relative py-8">
        <div className="relative z-10 flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
                    isCompleted
                      ? "bg-green-600 border-green-100 text-white"
                      : "bg-white border-gray-100 text-gray-300"
                  )}
                >
                  <Icon className={clsx("text-lg", isCurrent && "animate-pulse")} />
                </div>
                <span className={clsx(
                  "mt-3 text-[11px] font-bold uppercase tracking-tight text-center",
                  isCompleted ? "text-green-700" : "text-gray-400"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute left-0 z-0 w-full h-1 px-10 bg-gray-100 top-13">
          <div
            className="h-full transition-all duration-700 ease-in-out bg-green-600"
            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl">
        {order.items?.[0]?.product?.images?.[0] && (
          <img
            src={order.items[0].product.images[0]}
            alt="product"
            className="object-cover w-16 h-16 bg-white rounded-lg shadow-sm"
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
            {order.items?.[0]?.product?.title || "Multiple Items"}
          </p>
          <p className="text-xs text-gray-500">
            {order.items?.length} item{order.items?.length > 1 ? 's' : ''} • {shipping?.status === 'delivered' ? 'Package arrived' : 'In progress'}
          </p>
        </div>
      </div>
    </div>
  );
};