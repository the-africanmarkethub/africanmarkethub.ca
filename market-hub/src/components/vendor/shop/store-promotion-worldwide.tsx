"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CreateCouponDialog } from "../coupon/create-coupon-dialog";
// import { CouponForm } from "../forms/coupon-form";
// import { DatePicker } from "../ui/date-picker";
import CouponsVouchersTable from "./coupon-vouchers-table";

export default function StorePromotionWorldwide() {
  const [createCouponOpen, setCreateCouponOpen] = useState(false);

  return (
    <div>
      <div className="flex items-start flex-col gap-y-4 mt-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-base leading-[22px] font-semibold text-[#292929] md:text-xl">
          Store Promotions Worldwide
        </h2>
        <div className="flex justify-end gap-x-2">
          <Button
            variant="outline"
            className="border-[#9C5432] text-xs font-semibold bg-white px-5 py-2.5 rounded-[32px] md:px-6 md:py-3 md:text-sm"
            onClick={() => setCreateCouponOpen(true)}
          >
            <Plus className="w-6 h-6" />
            Add New Coupon
          </Button>
          <Button className="bg-[#F28C0D] text-xs font-semibold px-5 py-2.5 hover:bg-[#F28C0D] text-white rounded-[32px] md:px-6 md:py-3 md:text-sm">
            <Plus className="w-6 h-6" />
            New Sales Event
          </Button>
        </div>
      </div>

      <CouponsVouchersTable />

      {/* <CouponForm /> */}

      {/* <DatePicker /> */}

      <CreateCouponDialog
        createCouponOpen={createCouponOpen}
        setCreateCouponOpen={setCreateCouponOpen}
      />
    </div>
  );
}
