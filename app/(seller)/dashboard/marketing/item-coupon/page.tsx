"use client";

import { LuShoppingCart } from "react-icons/lu"; 
import CouponTable from "../../order-management/components/OrdersTable";

export default function ItemCoupons() {
  return (
    <div>
      <div className="card mb-6 hover:shadow-lg transition-all duration-300 rounded-xl bg-white cursor-default">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-800!">
            <LuShoppingCart />All Coupons
          </h2> 
          <button className="btn btn-primary">Add Coupon</button>
        </div>
        <p className="text-sm mt-1 text-gray-600">
          From your dashboard, you can easily access and control your recent
          <span className="text-orange-800"> item coupon</span>
        </p>
      </div>
        <div className="space-y-6 mt-6">
          <CouponTable limit={10}  />
        </div>
    </div>
  );
}
