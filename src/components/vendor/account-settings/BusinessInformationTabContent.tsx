"use client";

import { Card, CardContent, CardHeader } from "@/components/vendor/ui/card";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

export default function BusinessInformationTabContent({
  onEdit,
}: {
  onEdit: () => void;
}) {
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
            Phone Number
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Name
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            Base Corporation
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Type
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            Wholesale
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Email Address
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            tim.jennings@example.com
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Business Description
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">City</h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-[#292929] mb-[5px]">
            Country/State
          </h3>
          <p className="text-xs font-normal text-[#989898] md:text-sm">
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
