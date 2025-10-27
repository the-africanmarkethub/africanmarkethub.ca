import { PageHeader } from "@/components/vendor/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/vendor/ui/tabs";
import FaqTabContent from "@/components/vendor/vendor-support/Faq-tab-content";
import { TicketingTable } from "@/components/vendor/vendor-support/ticketing-table";
import { TrainingTutorials } from "@/components/vendor/vendor-support/training-tutorials";

export default function HelpCentrePage() {
  return (
    <div className="p-6 space-y-6 md:space-y-8 md:p-8">
      <PageHeader title="Vendor Support" />
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="faq"
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
          >
            FAQ
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="ticket"
          >
            Support Ticket System
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="training"
          >
            Trainings & Tutorials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <FaqTabContent />
        </TabsContent>

        <TabsContent value="ticket">
          <TicketingTable />
        </TabsContent>

        <TabsContent value="training" className="mt-4 sm:mt-14">
          <TrainingTutorials />
        </TabsContent>
      </Tabs>
    </div>
  );
}
