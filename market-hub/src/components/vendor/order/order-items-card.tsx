"use client";

import { Button } from "@/components/vendor/ui/button";
import { Card, CardContent } from "@/components/vendor/ui/card";
import { Badge } from "@/components/vendor/ui/badge";
import Image from "next/image";
import { type OrderItem } from "./order-items";

export default function OrderItemCard(props: OrderItem) {
  return (
    <Card className="w-full rounded-[16px] shadow-none bg-white p-2">
      <CardContent className="p-0 space-y-2.5">
        <div className="flex items-start">
          <Badge
            className="p-1"
            variant={props.status === "Pending" ? "destructive" : "warning"}
          >
            {props.status}
          </Badge>
        </div>

        <div className="flex gap-4 py-2.5 border-y">
          <div className="flex-shrink-0">
            <Image
              src={props.image}
              alt={props.name}
              width={80}
              height={70}
              className="object-cover rounded-[16px]"
            />
          </div>

          <div className="flex-1 min-w-0 text-[#525252]">
            <h3 className="font-normal text-sm truncate">{props.name}</h3>
            <p className="text-[16px] leading-[22px] font-semibold mt-1.5">
              {props.price}
            </p>
            <div className="text-sm mt-3.5">
              <span className="font-bold">Color:</span> {props.color}
              <span className="ml-4 font-medium">Quantity:</span>{" "}
              {props.quantity}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-full font-semibold bg-[#FFFFFF] px-5 py-2.5 border border-[#9C5432]"
          >
            Fulfill Item
          </Button>
          <Button className="flex font-semibold rounded-full text-[#FFFFFF] px-5 py-2.5 items-center gap-2">
            Create shipping label
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
