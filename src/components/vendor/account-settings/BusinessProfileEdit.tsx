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
import { useState, useEffect } from "react";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";
import { useGetShopDetails } from "@/hooks/vendor/useGetShopDetails";
import { useUpdateShop } from "@/hooks/vendor/useUpdateShop";
import { useLocation } from "@/hooks/vendor/useLocation";

export function BusinessProfileEdit({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const { data: shopDetails, isLoading } = useGetShopDetails();
  const { mutate: updateShop, isPending } = useUpdateShop();
  const { data: location } = useLocation();
  
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessAddress: "",
    country_id: "",
    state_id: "",
    city_id: "",
    authorized: false,
  });

  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Populate form with shop details when data is loaded
  useEffect(() => {
    if (shopDetails?.shops && shopDetails.shops[0]) {
      const shop = shopDetails.shops[0];
      setFormData({
        businessName: shop.name || "",
        businessType: shop.type || "",
        businessDescription: shop.description || "",
        businessAddress: shop.address || "",
        country_id: shop.country_id?.toString() || "",
        state_id: shop.state_id?.toString() || "",
        city_id: shop.city_id?.toString() || "",
        authorized: false,
      });
    }
  }, [shopDetails]);

  // Set up location options when location data loads
  useEffect(() => {
    if (location && location?.length > 0) {
      const countries = location?.map(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => ({
          label: country.name,
          value: country.id.toString(),
        })
      );
      setCountryOptions(countries);
    }
  }, [location]);

  // Update states when country is selected
  useEffect(() => {
    if (formData.country_id && location) {
      const selectedCountry = location.find(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => country.id.toString() === formData.country_id
      );

      if (selectedCountry && selectedCountry.state) {
        const states = selectedCountry.state.map(
          (state: { id: number; name: string }) => ({
            label: state.name,
            value: state.id.toString(),
          })
        );
        setStateOptions(states);

        // Reset city selection when country changes
        if (cityOptions.length > 0) {
          setFormData(prev => ({ ...prev, city_id: "" }));
          setCityOptions([]);
        }
      }
    }
  }, [formData.country_id, location]);

  // Update cities when state is selected
  useEffect(() => {
    if (formData.state_id && formData.country_id && location) {
      const selectedCountry = location.find(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => country.id.toString() === formData.country_id
      );

      if (selectedCountry) {
        const cities = selectedCountry.city
          .filter(
            (city: { state_id: number; name: string; id: number }) =>
              city.state_id.toString() === formData.state_id
          )
          .map((city: { state_id: number; name: string; id: number }) => ({
            label: city.name,
            value: city.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [formData.state_id, formData.country_id, location]);

  const handleSave = () => {
    if (!shopDetails?.shops?.[0]?.slug) {
      console.error("No shop slug available");
      return;
    }

    const payload = {
      name: formData.businessName,
      type: formData.businessType,
      description: formData.businessDescription,
      address: formData.businessAddress,
      country_id: formData.country_id,
      state_id: formData.state_id,
      city_id: formData.city_id,
    };

    updateShop(
      { slug: shopDetails.shops[0].slug, payload },
      {
        onSuccess: () => {
          onSave();
        },
        onError: (error) => {
          console.error("Failed to update shop:", error);
        },
      }
    );
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
            <CustomLabel htmlFor="country_id" text="Country" />
            <Select
              value={formData.country_id}
              onValueChange={(value) =>
                setFormData({ ...formData, country_id: value })
              }
            >
              <SelectTrigger className="w-full px-4 h-[54px] py-3 bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {countryOptions.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="state_id" text="State" />
            <Select
              value={formData.state_id}
              onValueChange={(value) =>
                setFormData({ ...formData, state_id: value })
              }
              disabled={!formData.country_id || stateOptions.length === 0}
            >
              <SelectTrigger className="w-full px-4 h-[54px] py-3 bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {stateOptions.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="city_id" text="City" />
            <Select
              value={formData.city_id}
              onValueChange={(value) =>
                setFormData({ ...formData, city_id: value })
              }
              disabled={!formData.state_id || cityOptions.length === 0}
            >
              <SelectTrigger className="w-full px-4 h-[54px] py-3 bg-white border border-[#EEEEEE] rounded-lg placeholder:text-[16px] font-normal text-[#7C7C7C] leading-[22px]">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {cityOptions.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="services">Services</SelectItem>
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
              disabled={isPending}
              className="bg-[#F28C0D] text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px] lg:text-[16px] lg:leading-[22px] disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
