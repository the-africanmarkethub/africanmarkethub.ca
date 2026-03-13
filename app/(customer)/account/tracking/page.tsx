"use client";

import {
  Order,
  OrderStatusTracker,
} from "@/app/track-order/components/OrderStatusTracker";
import { trackOrder } from "@/lib/api/trackOrder";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";

interface OrderResponse {
  status: string;
  order?: Order;
  message?: string;
}

const TrackOrderPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    setOrder(null);

    try {
      const data: OrderResponse = await trackOrder(email);
      if (data.status === "success" && data.order) {
        setOrder(data.order);
        toast.success("Order found!");
      } else {
        toast.error(data.message || "Customer not found");
      }
    } catch {
      toast.error("Customer not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 card">
        <h2 className="flex items-center text-lg font-semibold">
          <FiMapPin className="mr-2 text-xl text-hub-secondary" size={24} />
          Track Order
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter your email to view and manage delivery expectation of your
          <span className="text-hub-secondary"> Order </span>
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="w-full mt-5 mb-8 space-y-3 md:space-y-0 md:flex md:items-end md:gap-3"
      >
        <div className="flex-1 w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Enter your email address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary md:w-auto"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {order && <OrderStatusTracker order={order} />}

      {!order && !loading && (
        <div className="py-10 text-center border-2 border-green-200 border-dashed rounded-lg">
          <p className="text-gray-500">Your order status will appear here.</p>
        </div>
      )}
    </>
  );
};

export default TrackOrderPage;
