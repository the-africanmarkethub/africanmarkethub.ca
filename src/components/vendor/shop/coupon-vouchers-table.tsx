"use client";

import { useState } from "react";
import { Badge } from "@/components/vendor/ui/badge";
import { Button } from "@/components/vendor/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/vendor/ui/card";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { DataTable } from "../ui/data-table/DataTable";
import { useGetCoupons } from "@/hooks/vendor/useGetCoupons";

interface TableCoupon {
  id: string;
  code: string;
  discountType: string;
  product: string;
  expiryDate: string;
  status: "Active" | "Inactive";
}

const columns = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Discount Type",
    accessorKey: "discountType",
  },
  {
    header: "Product",
    accessorKey: "product",
  },
  {
    header: "Expiry",
    accessorKey: "expiryDate",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item: TableCoupon) => (
      <Badge variant={item.status === "Active" ? "success" : "destructive"}>
        {item.status}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function CouponsVouchersTable() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const { data: couponsResponse, isLoading, error } = useGetCoupons({
    page: currentPage,
    per_page: perPage,
  });

  // Transform API data to table format
  const coupons: TableCoupon[] = couponsResponse?.data?.map((coupon) => ({
    id: String(coupon.id),
    code: coupon.discount_code,
    discountType: coupon.discount_type === "percentage" 
      ? `${coupon.discount_rate}% Off` 
      : `$${coupon.discount_rate} Off`,
    product: coupon.product?.title || "N/A",
    expiryDate: new Date(coupon.end_time).toLocaleDateString(),
    status: coupon.status === "active" ? "Active" : "Inactive",
  })) || [];

  if (error) {
    return (
      <div className="w-full bg-white mt-8 rounded-[8px] p-6">
        <p className="text-red-500 text-center">Failed to load coupons. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white mt-8 rounded-[8px]">
      <Card className="p-0 border-0 shadow-none rounded-[8px]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-lg/6 md:text-xl/8">
              Coupons & Vouchers
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="p-0">
            <div className="w-full pb-5 bg-white">
              <div className="flex items-center pl-6 pt-5 pb-[13px] md:pt-7">
                <h1 className="text-base leading-[22px] font-medium text-[#292929] md:text-xl/8">
                  Active Coupons
                </h1>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : coupons.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500">No coupons found. Create your first coupon!</p>
                </div>
              ) : (
                <DataTable
                  data={coupons}
                  columns={columns}
                  enableSelection
                  currentPage={currentPage}
                  rowsPerPage={perPage}
                  totalItems={couponsResponse?.data?.length || 0}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}