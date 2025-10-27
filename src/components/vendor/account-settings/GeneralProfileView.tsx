"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/vendor/ui/tabs";
import BusinessInformationTabContent from "./BusinessInformationTabContent";
import PaymentDetailsTabContent from "./PaymentDetailsTabContent";
import { AccountSecurityTabContent } from "./AccountSecurityTabContent";

export function GeneralProfileView({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="">
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="business"
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
          >
            Business Information
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="payment"
          >
            Payment Details
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="security"
          >
            Account Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <BusinessInformationTabContent onEdit={onEdit} />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentDetailsTabContent />
        </TabsContent>

        <TabsContent value="security">
          <AccountSecurityTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
