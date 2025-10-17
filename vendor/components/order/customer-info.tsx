import Image from "next/image";
import { Card } from "../ui/card";

export interface Address {
  id: number;
  customer_id: number;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  address_label: string;
  phone: string;
  created_at: string;
  updated_at: string;
}
export interface Customer {
  profile_photo: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  address: Address;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  order_created_at: string;
}

export default function CustomerInfo(props: Customer) {
  return (
    <div>
      <Card className="flex flex-col bg-[#FFFFFF] border-none rounded-2xl p-4 xl:flex-row xl:border-0 xl:py-[30.5px] xl:px-[38.5px]">
        <div className="flex-1 flex gap-4 items-center pb-4 border-b border-[#989898] xl:border-b-0 xl:border-r xl:pr-[41px]">
          <div className="h-[72px] flex justify-center items-center w-[72px] border-primary border-[7px] rounded-full overflow-hidden xl:border-[5px] ">
            <Image
              src={props?.profile_photo}
              alt={props?.name + props?.last_name}
              width={72}
              height={72}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg/6 text-[#292929] font-normal">
              {props?.name}, {props?.last_name}
            </h2>
            <p className="text-sm text-[#989898]">{props?.email}</p>
          </div>
        </div>

        <div className="flex-1 border-b py-4 border-[#989898] xl:px-[41px] xl:border-b-0 xl:border-r">
          <h3 className="text-sm font-normal text-[#989898] mb-[11px] xl:mb-3.5">
            PERSONAL INFORMATION
          </h3>
          <div className="xl:space-y-7">
            <div className="flex items-center gap-[21px]">
              <div className="flex h-[60px] justify-between text-[#292929] text-sm font-medium flex-col xl:gap-y-6 xl:h-full xl:justify-normal">
                <div>Contact Number</div>
                <div>Member Since</div>
              </div>

              <div className="flex h-[60px] justify-between font-normal text-sm flex-col xl:gap-6 xl:h-full xl:justify-normal">
                <div> {props?.phone}</div>
                <div>{props?.created_at}</div>
              </div>
            </div>

            <p className="hidden mt-4 text-sm text-[#464646] text-muted-foreground xl:block">
              {props?.order_created_at}
            </p>
          </div>
        </div>

        <div className="flex-1 py-4 xl:pl-[41px]">
          <div className="text-sm mb-4 font-normal xl:mb-[13px]">
            <h3 className="text-[#989898] mb-[11px] xl:mb-3.5">
              Shipping Address
            </h3>
            <div className="text-[#292929]">
              <span>{props?.address?.street_address}</span>{" "}
              <span>
                {props?.address?.city}, {props?.address?.state}{" "}
                {props?.address?.zip_code}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-normal text-[#989898] mb-1">
              Order History
            </h3>
            <div className="grid grid-cols-3 gap-x-2 xl:gap-4">
              <div className="space-y-2">
                <div className="text-xl/8 font-semibold xl:text-2xl">
                  {props?.totalOrders}
                </div>
                <div className="text-sm font-normal text-[#989898]">
                  Total Order
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl/8 font-semibold xl:text-2xl">
                  {props?.completedOrders}
                </div>
                <div className="text-sm font-normal text-[#989898]">
                  Completed
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xl/8 font-semibold xl:text-2xl">
                  {props?.cancelledOrders}
                </div>
                <div className="text-sm font-normal text-[#989898]">
                  Cancelled
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
