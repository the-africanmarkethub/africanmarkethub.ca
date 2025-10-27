"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/vendor/ui/button";
import { Checkbox } from "@/components/vendor/ui/checkbox";

interface Coupon {
  id: string;
  title: string;
  code: string;
  amount: string;
  active: string;
  expiry: string;
  limitNumber: string;
}

export function CouponList() {
  const coupons: Coupon[] = [
    {
      id: "1",
      title: "Easter Promo",
      code: "ihs98734udf",
      amount: "50.00CAD",
      active: "9/23/16",
      expiry: "5/27/15",
      limitNumber: "80",
    },
    // Add more sample data as needed
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Status</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Date</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Location</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="w-[40px] p-4">
                <Checkbox />
              </th>
              <th className="text-left p-4">Coupon Title</th>
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Active</th>
              <th className="text-left p-4">Expiry</th>
              <th className="text-left p-4">Limit Number</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b">
                <td className="p-4">
                  <Checkbox />
                </td>
                <td className="p-4">{coupon.title}</td>
                <td className="p-4">{coupon.code}</td>
                <td className="p-4">{coupon.amount}</td>
                <td className="p-4">{coupon.active}</td>
                <td className="p-4">{coupon.expiry}</td>
                <td className="p-4">{coupon.limitNumber}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">1-20 of 300</div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Row/Page:</span>
            <Button variant="outline" className="flex items-center gap-2">
              <span>7/12</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                {"<<"}
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                {"<"}
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                1
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-8 h-8 p-0 bg-orange-500"
              >
                2
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                3
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                4
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                5
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                {">"}
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
