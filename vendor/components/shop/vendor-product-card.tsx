import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { RatingStars } from "../RatingStars";

export interface VendorProduct {
  id: number;
  images: string[];
  title: string;
  average_rating: number;
  regular_price: string;
}

export default function VendorProductCard(props: VendorProduct) {
  return (
    <Card className="border-0 p-0 bg-transparent shadow-none">
      <div className="relative">
        <Image
          src={props.images[0]}
          alt={props.title}
          width={296}
          height={296}
          className="rounded-[16px] w-full h-full"
        />
      </div>
      <CardContent className="flex flex-col gap-y-1 p-2 border-0 lg:p-4 lg:gap-y-4">
        <h3 className="font-normal text-sm lg:text-lg/6">{props.title}</h3>
        {/* mobile */}
        <div className="xl:hidden">
          <RatingStars rating={4} width={16} height={16} />
        </div>
        {/* desktop */}
        <div className="hidden xl:block">
          <RatingStars rating={4} width={24} height={24} />
        </div>
        <p className="font-semibold text-[10px] leading-[13px] xl:text-lg/6">
          {props.regular_price ? `${props.regular_price} CAD` : ""}
        </p>
      </CardContent>
    </Card>
  );
}
