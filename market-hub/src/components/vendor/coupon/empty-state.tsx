"use client";

import { Card } from "@/components/vendor/ui/card";
import { Plus, Tag } from "lucide-react";
import SubmitButton from "@/components/vendor/SubmitButton";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();

  return (
    <Card className="flex flex-col items-center space-y-6 justify-center p-[189px] text-center">
      <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
        <Tag className="h-10 w-10 text-orange-500" />
      </div>
      <h3 className="text-base p-2 font-semibold mb-2">
        There are no open promotions
      </h3>
      <SubmitButton
        onClick={() => router.push("/vendor/products/promotion/add-coupon")}
        className="bg-primary w-[349px] h-[56px] text-[#FFFFFF] rounded-[39px]"
      >
        <Plus className="w-6 h-6" /> Create Promotional Discount
      </SubmitButton>
    </Card>
  );
}
