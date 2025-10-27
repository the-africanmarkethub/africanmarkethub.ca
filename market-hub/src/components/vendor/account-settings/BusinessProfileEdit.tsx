"use client";

import { Button } from "@/components/vendor/ui/button";
import { Card, CardContent } from "@/components/vendor/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/vendor/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Checkbox } from "@/components/vendor/ui/checkbox";
import { useState } from "react";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";

export function BusinessProfileEdit({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    businessName: "Base - Base Corporation",
    businessType: "wholesale",
    businessDescription: "",
    businessAddress: "",
    city: "",
    countryState: "",
    authorized: false,
  });

  const handleSave = () => {
    // Handle form submission logic here
    onSave();
  };

  return (
    <div className="">
      <Card className="px-4 py-8 bg-white rounded-2xl lg:p-8">
        <CardContent className="space-y-6 p-0">
          <div className="space-y-2">
            <CustomLabel htmlFor="businessName" text="Business Name" />
            <CustomInput
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="businessType" text="Business Type" />
            <Select
              value={formData.businessType}
              onValueChange={(value) =>
                setFormData({ ...formData, businessType: value })
              }
            >
              <SelectTrigger className="w-full px-4 h-[54px] py-3 bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <CustomLabel
              htmlFor="businessDescription"
              text="Business Description"
            />
            <Textarea
              id="businessDescription"
              placeholder="Your Description"
              value={formData.businessDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessDescription: e.target.value,
                })
              }
              className="min-h-[107px] resize-none w-full px-4 py-3 bg-white border border-[#EEEEEE] rounded-[8px] placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]"
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="businessAddress" text="Business Address" />
            <CustomInput
              id="businessAddress"
              placeholder="Business Address"
              value={formData.businessAddress}
              onChange={(e) =>
                setFormData({ ...formData, businessAddress: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="city" text="City" />
            <CustomInput
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="countryState" text=" Country/State" />
            <Select
              value={formData.countryState}
              onValueChange={(value) =>
                setFormData({ ...formData, countryState: value })
              }
            >
              <SelectTrigger className="w-full px-4 py-3 h-[54px] bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Country/State" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="us-ca">
                  United States - California
                </SelectItem>
                <SelectItem value="us-ny">United States - New York</SelectItem>
                <SelectItem value="us-tx">United States - Texas</SelectItem>
                <SelectItem value="us-il">United States - Illinois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="authorize"
              checked={formData.authorized}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, authorized: checked as boolean })
              }
              className="border-[#DCDCDC]"
            />
            <Label
              htmlFor="authorize"
              className="text-xs text-gray-[#292929] leading-relaxed lg:text-sm"
            >
              I authorize the platform to verify this account and initiate
              debits and credits as needed for services rendered.
            </Label>
          </div>

          <div className="flex flex-col justify-end gap-4 sm:flex-row">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-[#9C5432] text-sm font-semibold bg-white px-6 py-3 rounded-[32px] lg:text-[16px] lg:leading-[22px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#F28C0D] text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px] lg:text-[16px] lg:leading-[22px]"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
