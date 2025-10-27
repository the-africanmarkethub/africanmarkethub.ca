import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export interface ShopDetail {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string;
  email: string;
  phone: string;
}

export default function ShopDetails(props: ShopDetail) {
  return (
    <div className="px-8 pb-4 pt-8 bg-white rounded-lg xl:pt-[27px]">
      <div className="flex flex-col items-start justify-between gap-2 lg:flex-row">
        {/* Left side - Company info */}
        <div className="flex flex-col items-start gap-2 flex-1 xl:flex-row xl:gap-4">
          <div className="flex items-start gap-x-4">
            <div className="h-8 w-8 flex items-center justify-center xl:h-[140px] xl:w-[140px]">
              <Image
                src={props.logo}
                alt={props.name}
                width={140}
                height={140}
              />
            </div>
            <h2 className="font-semibold text-lg/6 text-[#F28C0D] xl:hidden">
              {props.name}
            </h2>
          </div>

          <p className="text-[#464646] w-full text-sm xl:hidden">
            {props.description}
          </p>

          {/* Company details (desktop) */}
          <div className="hidden flex-1 xl:block">
            <h2 className="font-semibold text-[#F28C0D] text-[28px] leading-8">
              {props.name}
            </h2>
            <p className="text-[#464646] w-full text-lg">{props.description}</p>
          </div>
        </div>

        {/* Right side - Contact info */}
        <div className="flex flex-col gap-y-4 lg:min-w-[300px] text-[#464646]">
          {/* Email */}
          <div className="flex items-center gap-x-2 text-sm">
            <Mail className="w-[22px] h-[22px]" />
            <span className="text-sm">{props.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-x-2 text-sm">
            <Phone className="w-[22px] h-[22px]" />
            <span className="text-sm">{props.phone}</span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-x-2 text-sm">
            <MapPin className="w-[22px] h-[22px]" />
            <span className="text-sm">{props.address}</span>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-x-2 text-sm">
            <Clock className="w-[22px] h-[22px]" />
            <span className="">Opens Monday - Friday (08:00)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
