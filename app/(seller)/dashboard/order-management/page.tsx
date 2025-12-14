"use client";

import { useState } from "react";
import OrdersTable from "./components/OrdersTable";
import { LuShoppingCart } from "react-icons/lu";
import { statusOptions } from "./[id]/page";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";

export default function Orders() {
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  return (
    <div>
      <div className="card mb-6 hover:shadow-lg transition-all duration-300 rounded-xl bg-white cursor-default">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-800!">
            <LuShoppingCart /> Orders
          </h2>
          <SelectDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
        <p className="text-sm mt-1 text-gray-600">
          From your dashboard, you can easily access and control your recent
          <span className="text-orange-800"> customer orders</span>
        </p>
      </div>
        <div className="space-y-6 mt-6">
          <OrdersTable limit={10} status={selectedStatus.value} />{" "}
        </div>
    </div>
  );
}
