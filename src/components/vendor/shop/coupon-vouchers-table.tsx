"use client";

import { useState } from "react";
import { Badge } from "@/components/vendor/ui/badge";
import { Button } from "@/components/vendor/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/vendor/ui/card";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { DataTable } from "../ui/data-table/DataTable";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  usageLimit: number | string;
  expiryDate: string;
  status: "Active" | "Inactive";
}

const coupons: Coupon[] = [
  {
    id: "1",
    code: "C1D2023",
    discountType: "20% Off",
    usageLimit: 100,
    expiryDate: "2024-12-31",
    status: "Active",
  },
  {
    id: "2",
    code: "B2G50OFF",
    discountType: "Fixed Amount",
    usageLimit: 50,
    expiryDate: "2025-01-15",
    status: "Inactive",
  },
  {
    id: "3",
    code: "FREESHIP",
    discountType: "Free Shipping",
    usageLimit: "Unlimited",
    expiryDate: "2024-06-30",
    status: "Active",
  },
  {
    id: "4",
    code: "SUMMER20",
    discountType: "Percentage",
    usageLimit: 200,
    expiryDate: "2024-08-31",
    status: "Active",
  },
  {
    id: "5",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "6",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "7",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "8",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "9",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "10",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "11",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "12",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "13",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "14",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "15",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "16",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "17",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "18",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "19",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "20",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "21",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "22",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "23",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "24",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "25",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "26",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "27",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "28",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "29",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "30",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "31",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "32",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "33",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "34",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "35",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "36",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "37",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "38",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "39",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
  {
    id: "40",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    usageLimit: 1,
    expiryDate: "2024-11-01",
    status: "Active",
  },
];

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
    header: "Usage Limit",
    accessorKey: "usageLimit",
  },
  {
    header: "Expiry",
    accessorKey: "expiryDate",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item: Coupon) => (
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
              <DataTable
                data={coupons}
                columns={columns}
                enableSelection
                currentPage={1}
                rowsPerPage={5}
                totalItems={40}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
