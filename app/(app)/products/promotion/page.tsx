"use client";

import { PageHeader } from "@/components/page-header";
import { CouponTable } from "@/components/coupon/coupon-table";

export default function ProductPromotionPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <PageHeader
        title="Product Promotion"
        description="Create and manage promotional campaigns for your products"
      />

      <CouponTable />
    </div>
  );
}
