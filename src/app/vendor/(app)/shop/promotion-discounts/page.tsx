import { PageHeader } from "@/components/vendor/page-header";
import FeaturedProducts from "@/components/vendor/shop/featured-products";
import StorePromotionWorldwide from "@/components/vendor/shop/store-promotion-worldwide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/vendor/ui/tabs";

export default function PromotionDiscountsPage() {
  return (
    <div className="p-6 xl:p-8">
      <PageHeader title="Promotions & Discounts" />
      <p className="font-normal text-sm leading-[22px] text-[#656565] mt-4 md:text-base">
        Create and manage promotional campaigns to boost your sales
      </p>
      <Tabs defaultValue="store-promotion" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="store-promotion"
            className="text-[10px] text-[#656565] ring-offset-0 text-wrap shadow-none font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
          >
            Store Promotion Worldwide
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] ring-0 text-wrap font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="featured-products"
          >
            Featured Products
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] text-wrap font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="flash-sales"
          >
            Flash Sales & Timed Discounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store-promotion" className="mt-0">
          <StorePromotionWorldwide />
        </TabsContent>

        <TabsContent value="featured-products">
          <FeaturedProducts />
        </TabsContent>

        <TabsContent value="flash-sales" className="mt-14">
          Reviews
        </TabsContent>
      </Tabs>
    </div>
  );
}
