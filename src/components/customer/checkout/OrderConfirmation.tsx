"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmation() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4">Order is Placed</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase! Your order is being processed.
      </p>
      <Link href="/orders/12345">
        <Button>View order</Button>
      </Link>
    </div>
  );
}
