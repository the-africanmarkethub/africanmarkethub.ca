"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/vendor/ui/button";
// import { Badge } from "@/components/vendor/ui/badge";
import Image from "next/image";
import { useCallback } from "react";

interface OrderItem {
  id: number;
  product: string;
  qty: number;
  price: string;
  discount?: string;
  total?: string;
  shippingStatus: "Shipped" | "Pending" | "Delivered" | "Cancelled";
  image?: string;
}

interface OrderItemCarouselProps {
  items: OrderItem[];
}

export function OrderItemCarousel({ items }: OrderItemCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="flex items-center gap-2 p-2">
                <div className="h-8 w-8 bg-gray-100 rounded-md overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.product}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Qty: {item.qty}</span>
                    {/* <span>•</span>
                    <Badge
                      variant={
                        item.shippingStatus === "Shipped"
                          ? "warning"
                          : item.shippingStatus === "Delivered"
                          ? "success"
                          : item.shippingStatus === "Cancelled"
                          ? "destructive"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {item.shippingStatus}
                    </Badge> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
