"use client";

import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Textarea } from "@/components/vendor/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Card, CardContent } from "@/components/vendor/ui/card";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";
import FileUpload from "../forms/file-upload";
import { useUpdateShopLogo } from "@/hooks/vendor/useUpdateShopLogo";
import { useUpdateShopBanner } from "@/hooks/vendor/useUpdateShopBanner";
// import { cn } from "@/lib/utils";

export interface EditShopFormData {
  name: string;
  type: string;
  description: string;
  address: string;
  logo?: string;
  banner?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
}

interface EditShopFormProps {
  onCancel: () => void;
  onSave: (data: EditShopFormData) => void;
  initialData?: Partial<EditShopFormData>;
  shopId?: string | number;
}

export default function EditShopForm({
  onCancel,
  onSave,
  initialData,
  shopId,
}: EditShopFormProps) {
  // const [selectedTheme, setSelectedTheme] = useState("black");
  const [formData, setFormData] = useState<EditShopFormData>({
    name: initialData?.name || "",
    type: initialData?.type || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    logo: initialData?.logo || "",
    banner: initialData?.banner || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const updateLogoMutation = useUpdateShopLogo();
  const updateBannerMutation = useUpdateShopBanner();

  // const themeColors = [
  //   { name: "black", color: "bg-black" },
  //   { name: "blue", color: "bg-[#00569F]" },
  //   { name: "green", color: "bg-[#21B221]" },
  //   { name: "yellow", color: "bg-[#FF8282]" },
  //   { name: "red", color: "bg-[#EF2D03]" },
  // ];

  // const days = [
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  //   "Sunday",
  // ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleScheduleChange = (
  //   day: string,
  //   type: "open" | "close",
  //   value: string
  // ) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     schedule: {
  //       ...prev.schedule,
  //       [day.toLowerCase()]: {
  //         ...prev.schedule[day.toLowerCase() as keyof typeof prev.schedule],
  //         [type]: value,
  //       },
  //     },
  //   }));
  // };

  const handleSave = () => {
    // Include file objects if they were changed
    const dataToSave = {
      ...formData,
      logoFile,
      bannerFile,
    } as EditShopFormData & { logoFile: File | null; bannerFile: File | null };
    onSave(dataToSave as EditShopFormData);
  };

  return (
    <div className="bg-white">
      <Card className="px-6 pt-8 bg-white rounded-[16px] border-0 shadow-none md:p-8 md:border">
        <h1 className="text-xl/8 font-semibold pb-6 md:hidden">
          Edit Shop Profile & Branding
        </h1>
        <CardContent className="p-0 space-y-4">
          <div className="space-y-2">
            <CustomLabel htmlFor="businessName" text="Business Name" />
            <CustomInput
              id="businessName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter business name"
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="businessType" text="Business Type" />
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="w-full px-4 h-[54px] py-3 bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="businessLogo" text="Business Logo" />
            <FileUpload
              initialUrl={formData.logo}
              onChange={async (file) => {
                setLogoFile(file);
                if (file && shopId) {
                  // Upload logo immediately
                  try {
                    await updateLogoMutation.mutateAsync({
                      id: shopId.toString(),
                      logoFile: file,
                    });
                    // Update formData with file object URL for preview
                    setFormData((prev) => ({
                      ...prev,
                      logo: URL.createObjectURL(file),
                    }));
                  } catch (error) {
                    console.error("Failed to update logo:", error);
                  }
                } else if (file) {
                  // Just update preview if no shopId
                  setFormData((prev) => ({
                    ...prev,
                    logo: URL.createObjectURL(file),
                  }));
                }
              }}
              label="Upload Logo"
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="businessBanner" text="Business Banner" />
            <FileUpload
              initialUrl={formData.banner}
              onChange={async (file) => {
                setBannerFile(file);
                if (file && shopId) {
                  // Upload banner immediately
                  try {
                    await updateBannerMutation.mutateAsync({
                      id: shopId.toString(),
                      bannerFile: file,
                    });
                    // Update formData with file object URL for preview
                    setFormData((prev) => ({
                      ...prev,
                      banner: URL.createObjectURL(file),
                    }));
                  } catch (error) {
                    console.error("Failed to update banner:", error);
                  }
                } else if (file) {
                  // Just update preview if no shopId
                  setFormData((prev) => ({
                    ...prev,
                    banner: URL.createObjectURL(file),
                  }));
                }
              }}
              label="Upload Banner"
            />
          </div>

          {/* <div className="">
            <CustomLabel htmlFor="storeTheme" text="Store Theme" />
            <div className="flex gap-x-4 mt-3">
              {themeColors.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme.name)}
                  className={cn(
                    "relative w-4 h-4 rounded-full transition-all duration-200 hover:scale-105",
                    theme.color,
                    selectedTheme === theme.name &&
                      "ring-2 ring-gray-300 ring-offset-4"
                  )}
                />
              ))}
            </div>
          </div> */}

          <div className="space-y-2">
            <CustomLabel
              htmlFor="businessDescription"
              text="Business Description"
            />
            <Textarea
              id="businessDescription"
              placeholder="Your Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="min-h-[107px] resize-none w-full px-4 py-3 bg-white border border-[#EEEEEE] rounded-[8px] placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]"
            />
          </div>

          {/* <div className="space-y-2">
            <CustomLabel htmlFor="emailAddress" text="Email Address" />
            <CustomInput
              id="emailAddress"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={(e) =>
                setFormData({ ...formData, emailAddress: e.target.value })
              }
            />
          </div> */}

          {/* <div className="space-y-2">
            <CustomLabel htmlFor="phoneNumber" text="Phone Number" />
            <CustomInput
              id="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </div> */}

          <div className="space-y-2">
            <CustomLabel htmlFor="businessAddress" text="Business Address" />
            <CustomInput
              id="businessAddress"
              placeholder="Business Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* <div className="space-y-2">
            <CustomLabel htmlFor="city" text="City" />
            <CustomInput
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div> */}

          {/* <div className="space-y-2">
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
          </div> */}
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-2 px-4 pb-[37px] mt-6 md:mt-4 md:flex-row md:justify-end md:px-0">
        <Button
          onClick={handleSave}
          className="bg-[#F28C0D] text-sm font-semibold hover:bg-[#F28C0D] w-full text-white rounded-[32px] md:max-w-[250px]"
        >
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-[#9C5432] text-sm font-semibold bg-white w-full px-6 py-3 rounded-[32px] md:max-w-[250px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
