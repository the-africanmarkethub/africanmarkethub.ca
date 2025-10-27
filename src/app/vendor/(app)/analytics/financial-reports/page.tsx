import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/vendor/ui/tabs";
import React from "react";
import RevenueTabContent from "@/components/vendor/analytics/revenue-tab-content";
import RefundTabContent from "@/components/vendor/analytics/refund-tab-content";
import TaxReportsTabContent from "@/components/vendor/analytics/tax-reports-tab-content";

function Page() {
  return (
    <div className="flex flex-col p-6 gap-y-6 xl:p-8 xl:gap-y-8">
      <div className="flex-between">
        <h1 className="text-xl/8 font-medium xl:text-2xl">Financial Reports</h1>
        <Button className="flex rounded-full text-[#FFFFFF] px-4 py-2 items-center gap-2 md:px-6 md:py-3">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="revenue"
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="refund"
          >
            Refund & Return
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]t"
            value="tax"
          >
            Tax Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <RevenueTabContent />
        </TabsContent>

        <TabsContent value="refund">
          <RefundTabContent />
        </TabsContent>

        <TabsContent value="tax">
          <TaxReportsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
