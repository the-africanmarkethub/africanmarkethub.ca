"use client";

import {
  OrderStatusTracker,
} from "@/app/track-order/components/OrderStatusTracker";
import { Order, OrderResponse } from "@/interfaces/orders";
import { trackOrder } from "@/lib/api/trackOrder";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";


const TrackOrderPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter an email or order ID.");
      return;
    }
    setLoading(true);
    setOrder(null);

    try {
      const isEmail = query.includes("@");
      const emailParam = isEmail ? query.trim() : "";
      const orderIdParam = !isEmail ? query.trim() : "";

      const response: OrderResponse = await trackOrder(emailParam, orderIdParam);

      if (response.status === "success" && response.data) {
        setOrder(response.data);
        toast.success("Order details loaded");
      } else {
        toast.error(response.message || "Order not found");
      }
    } catch (error) {
      toast.error("Unable to fetch order details");
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
        className="w-full mt-6 mb-8 space-y-4 md:space-y-0 md:flex md:items-end md:gap-3"
      >
        <div className="flex-1">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email or Order ID
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. name@email.com or #12345"
            className="w-full input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-1/6 py-3.5! btn btn-primary"
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
