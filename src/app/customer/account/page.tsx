"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_photo?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface Order {
  id: string;
  order_id: string;
  date: string;
  total: string;
  status: "Shipping" | "Cancelled" | "Delivered";
  items_count: number;
}

export default function AccountOverview() {
  const { isAuthenticated, user: authUser } = useAuthGuard();
  const [recentOrders] = useState<Order[]>([
    {
      id: "1",
      order_id: "#738",
      date: "8 Sep, 2024",
      total: "135.00 CAD (5 Products)",
      status: "Shipping",
      items_count: 5,
    },
    {
      id: "2",
      order_id: "#738",
      date: "8 Sep, 2020",
      total: "135.00 CAD (5 Products)",
      status: "Cancelled",
      items_count: 5,
    },
    {
      id: "3",
      order_id: "#738",
      date: "8 Sep, 2020",
      total: "135.00 CAD (5 Products)",
      status: "Delivered",
      items_count: 5,
    },
    {
      id: "4",
      order_id: "#738",
      date: "8 Sep, 2020",
      total: "135.00 CAD (5 Products)",
      status: "Delivered",
      items_count: 5,
    },
  ]);

  // Add address to user for display
  const user = authUser
    ? {
        ...authUser,
        address: {
          street: "4140 Parker Rd",
          city: "Allentown",
          state: "New Mexico",
          zip: "31134",
        },
      }
    : null;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Shipping":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isAuthenticated === null || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Hello, {user.name} {user.last_name}
              </h2>
              <p className="text-gray-600 mb-8">
                From your account dashboard, you can easily check & view your
                Recent Orders, manage your Shipping and Billing Addresses and
                edit your Password and Account Details.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <Image
                      src={user.profile_photo || "/icon/auth.svg"}
                      alt={`${user.name} ${user.last_name}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.name} {user.last_name}
                  </h3>
                  <p className="text-gray-600 mb-4">Customer</p>
                  <Link
                    href="/customer/settings"
                    className="text-[#F28C0D] hover:text-orange-600 font-medium transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Shipping
                    </h3>
                    <div className="w-10 h-10 bg-[#F28C0D] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {user.name} {user.last_name}
                    </p>
                    <p className="text-gray-600">
                      {user.address?.street}, {user.address?.city},{" "}
                      {user.address?.state} {user.address?.zip}
                    </p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phone}</p>
                  </div>
                  <Link
                    href="/customer/address"
                    className="inline-block mt-4 text-[#F28C0D] hover:text-orange-600 font-medium transition-colors"
                  >
                    Edit Address
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Recent Order History
                </h3>
                <Link
                  href="/customer/orders"
                  className="text-[#F28C0D] hover:text-orange-600 font-medium transition-colors"
                >
                  See all orders
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {order.order_id}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {order.total}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-[#F28C0D] hover:text-orange-600 font-medium transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    </>
  );
}
