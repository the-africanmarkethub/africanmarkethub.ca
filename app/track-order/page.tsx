"use client";

import { trackOrder } from "@/lib/api/trackOrder";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {  OrderStatusTracker } from "./components/OrderStatusTracker";
import { Order, OrderResponse } from "@/interfaces/orders";

 

const TrackOrderPage: React.FC = () => {
  const [query, setQuery] = useState("");  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter an email or order ID.");
      return;
    }

    setLoading(true);
    setOrder(null);

    try {
      // Logic to determine if input is email or ID
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-sm rounded-2xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Track Your Order</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter your details to view your shipping progress.
          </p>

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
            <div className="py-12 text-center border-2 border-gray-100 border-dashed rounded-2xl">
              <p className="text-sm text-gray-400">
                Enter your info above to see tracking details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;