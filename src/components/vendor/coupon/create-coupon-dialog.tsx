"use client";

import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/vendor/ui/dialog";
import { ArrowLeft, X, Calendar } from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Input } from "@/components/vendor/ui/input";
import { useAddCoupon } from "@/hooks/vendor/useAddCoupon";
import { useGetProducts } from "@/hooks/vendor/useGetProducts";
import { toast } from "sonner";

type Props = {
  createCouponOpen: boolean;
  setCreateCouponOpen: (state: boolean) => void;
};

export const CreateCouponDialog = (props: Props) => {
  const [discountCode, setDiscountCode] = useState("123SUM");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discountRate, setDiscountRate] = useState("20");
  const [discountType, setDiscountType] = useState("percentage");
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("active");
  const [notifyUsers, setNotifyUsers] = useState("false");

  const { mutate: createCoupon, isPending } = useAddCoupon();
  const { data: productsResponse } = useGetProducts();
  const products = productsResponse?.data.data || [];

  const handleSubmit = () => {
    // Validation
    if (!discountCode || !startTime || !endTime || !discountRate || !productId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Date validation - ensure end date is after start date
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (endDate <= startDate) {
      toast.error("The end time field must be a date after start time.");
      return;
    }

    // Create payload that matches the CouponForm structure
    const couponData = {
      product_id: productId,
      start_time: startTime,
      end_time: endTime,
      discount_rate: discountRate,
      notify_users: notifyUsers,
      status: status,
      discount_type: discountType,
      discount_code: discountCode,
    };

    createCoupon(couponData, {
      onSuccess: () => {
        props.setCreateCouponOpen(false);
        // Reset form
        setDiscountCode("123SUM");
        setStartTime("");
        setEndTime("");
        setDiscountRate("20");
        setDiscountType("percentage");
        setProductId("");
        setStatus("active");
        setNotifyUsers("false");
      },
    });
  };

  return (
    <Dialog
      open={props.createCouponOpen}
      onOpenChange={props.setCreateCouponOpen}
    >
      <DialogContent className="sm:max-w-[555px] max-h-[90vh] p-0 bg-white [&>button]:hidden overflow-auto">
        <DialogHeader className="flex-row flex-between px-6 py-4 border-b border-[#EEEEEE]">
          <DialogTitle className="flex items-center justify-start gap-x-2.5">
            <Button
              className="bg-white flex-center w-10 h-10 border border-[#F0EEF0] rounded-full hover:bg-white p-0"
              onClick={() => props.setCreateCouponOpen(false)}
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Button>
            <p className="text-xl font-medium text-[#292929]">Create Coupon Code</p>
          </DialogTitle>
          <button onClick={() => props.setCreateCouponOpen(false)}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </DialogHeader>
        
        <div className="px-6 py-4 pb-6 space-y-4">
          {/* Coupon Code */}
          <div>
            <Label htmlFor="couponCode" className="text-sm font-medium text-[#292929] mb-2 block">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-[#292929] mb-2 block">
                State Date
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-[#292929] mb-2 block">
                End Date
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="Code"
                  className="w-full border-2 border-dashed border-purple-400 rounded-md px-3 py-2 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Discount Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountValue" className="text-sm font-medium text-[#292929] mb-2 block">
                Discount Value
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                placeholder="E.g: 20"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="discountType" className="text-sm font-medium text-[#292929] mb-2 block">
                Discount Type
              </Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <Label htmlFor="productId" className="text-sm font-medium text-[#292929] mb-2 block">
              Apply To Product
            </Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="w-full border border-gray-300 rounded-md">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-8 py-4 text-center text-muted-foreground text-sm">
                    No products available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status and Notify Users */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-[#292929] mb-2 block">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deactivate">Deactivate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notifyUsers" className="text-sm font-medium text-[#292929] mb-2 block">
                Notify Users
              </Label>
              <Select value={notifyUsers} onValueChange={setNotifyUsers}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => props.setCreateCouponOpen(false)}
              className="flex-1 border-[#9C5432] text-sm font-semibold bg-white px-6 py-3 rounded-[32px] text-[#9C5432] hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-[#F28C0D] flex-1 text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px] px-6 py-3 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
