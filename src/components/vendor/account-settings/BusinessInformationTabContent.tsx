"use client";

import { Card, CardContent, CardHeader } from "@/components/vendor/ui/card";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { useGetShopDetails } from "@/hooks/vendor/useGetShopDetails";

const ProfileSkeleton = () => (
  <CardContent className="px-6 py-[18px] border border-[#F0EEF0] bg-white rounded-2xl space-y-6 xl:space-y-8">
    {[...Array(7)].map((_, index) => (
      <div key={index}>
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-3 w-full bg-gray-100 animate-pulse rounded"></div>
      </div>
    ))}
  </CardContent>
);

export default function BusinessInformationTabContent({
  onEdit,
}: {
  onEdit: () => void;
}) {
  const { data: shopDetails, isLoading, error } = useGetShopDetails();
  
  // Debug logging
  console.log("BusinessInformationTabContent Debug:", {
    shopDetails,
    isLoading,
    error,
    hasShop: !!shopDetails?.shop
  });

  if (isLoading) {
    return (
      <Card className="border-0">
        <CardHeader className="flex-row flex-between px-6 py-2 my-4 border border-[#F0EEF0] bg-white rounded-2xl">
          <h2 className="text-[16px] leading-[22px] font-semibold md:text-xl">
            Profile Settings
          </h2>
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </CardHeader>
        <ProfileSkeleton />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0">
        <CardHeader className="flex-row flex-between px-6 py-2 my-4 border border-[#F0EEF0] bg-white rounded-2xl">
          <h2 className="text-[16px] leading-[22px] font-semibold md:text-xl">
            Profile Settings
          </h2>
        </CardHeader>
        <CardContent className="px-6 py-[18px] border border-[#F0EEF0] bg-white rounded-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">Failed to load shop details: {error.message}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shopDetails) {
    return (
      <Card className="border-0">
        <CardHeader className="flex-row flex-between px-6 py-2 my-4 border border-[#F0EEF0] bg-white rounded-2xl">
          <h2 className="text-[16px] leading-[22px] font-semibold md:text-xl">
            Profile Settings
          </h2>
        </CardHeader>
        <CardContent className="px-6 py-[18px] border border-[#F0EEF0] bg-white rounded-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">No shop data received from server</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shopDetails.shops || !shopDetails.shops[0]) {
    return (
      <Card className="border-0">
        <CardHeader className="flex-row flex-between px-6 py-2 my-4 border border-[#F0EEF0] bg-white rounded-2xl">
          <h2 className="text-[16px] leading-[22px] font-semibold md:text-xl">
            Profile Settings
          </h2>
        </CardHeader>
        <CardContent className="px-6 py-[18px] border border-[#F0EEF0] bg-white rounded-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">No shop found for this vendor</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const shop = shopDetails.shops[0];

  return (
    <Card className="border-0">
      <CardHeader className="flex-row flex-between px-6 py-2 my-4 border border-[#F0EEF0] bg-white rounded-2xl">
        <h2 className="text-[16px] leading-[22px] font-semibold md:text-xl">
          Profile Settings
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-[#F28C0D] hover:[#F28C0D]"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="px-6 py-[18px] border border-[#F0EEF0] bg-white rounded-2xl space-y-6 xl:space-y-8">
        <div>
          <h3 className="font-semibold text-[16px] leading-[22px] text-[#292929] mb-[5px]">
            Business Name
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.name || "No business name provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Type
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.type || "No business type specified"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Address
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.address || "No address provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Description
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.description || "No description provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">City</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.city?.name || "No city provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">State</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.state?.name || "No state provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">Category</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.category?.name || "No category provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">Vendor</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.vendor ? `${shop.vendor.name} ${shop.vendor.last_name}` : "No vendor information"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">Vendor Email</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.vendor?.email || "No email provided"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">Vendor Phone</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            {shop.vendor?.phone || "No phone provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
