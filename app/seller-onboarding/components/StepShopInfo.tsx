"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { FaPencil, FaImage, FaCloudArrowUp } from "react-icons/fa6";

import { listCategories } from "@/lib/api/category";
import {
  getMyShop,
  saveShop,
  updateShopLogo,
  updateShopBanner,
} from "@/lib/api/seller/shop";
import { StepProps } from "@/interfaces/StepProps";
import { countryCodeToFlag } from "@/utils/countryFlag";
import CategorySelector from "@/app/(seller)/dashboard/shop-management/components/CategorySelector";
import GoogleAddressAutocomplete from "@/app/(seller)/dashboard/shop-management/components/GoogleAddressAutocomplete";
import PhoneInput from "@/app/(seller)/dashboard/shop-management/components/PhoneInput";
import ShopHeaderCard from "@/app/(seller)/dashboard/shop-management/components/ShopHeaderCard";
import TextareaField from "@/app/(seller)/dashboard/shop-management/components/TextareaField";
import TextInput from "@/app/(seller)/dashboard/shop-management/components/TextInput";
import { getAddress } from "@/lib/api/auth/shipping";
import SelectField, {
  DefaultOption,
} from "@/app/components/common/SelectField";
import {
  TYPES,
  LOCALDELIVERYOPTION,
  ID_OPTIONS,
  SelectOption,
} from "@/setting";
import { validateImageFile } from "@/utils/validateImageFile";
import { Shop } from "@/interfaces/shop";

export default function StepShopInfo({ onNext }: StepProps) {
  const MAX_DESC_LENGTH = 500;

  const [hasExistingShop, setHasExistingShop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingMode, setUploadingMode] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [shopData, setShopData] = useState<Shop>();
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zip, setZip] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);

  // Media States
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [idDocUrl, setIdDocUrl] = useState<string | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);

  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [localDelivery, setLocalDelivery] = useState<SelectOption>(
    LOCALDELIVERYOPTION[2],
  );
  const [identificationType, setIdentificationType] =
    useState<DefaultOption | null>(ID_OPTIONS[0]);

  const [dialCode, setDialCode] = useState("+1");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // --- Memory Cleanup ---
  useEffect(() => {
    return () => {
      [logoUrl, bannerUrl, idDocUrl].forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [logoUrl, bannerUrl, idDocUrl]);

  // --- Google Maps Script ---
  useEffect(() => {
    if ((window as any).google?.maps?.places) {
      setGoogleLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const handleMediaChange = async (
    file: File,
    mode: "logo" | "banner" | "document",
  ) => {
    // FIX: Destructure the result to get valid and error
    const { valid, error } = validateImageFile(
      file,
      mode === "document" ? "document" : mode,
    );

    if (!valid) {
      toast.error(error || "Invalid file"); // Tell the user WHY it failed
      return; // Stop execution
    }

    setUploadingMode(mode);
    const localPreview = URL.createObjectURL(file);

    if (mode === "logo") {
      setLogoUrl(localPreview);
      setLogoFile(file);
    } else if (mode === "banner") {
      setBannerUrl(localPreview);
      setBannerFile(file);
    } else {
      setIdDocUrl(localPreview);
      setIdDocFile(file);
    }

    // Auto-upload logic for existing shops
  if (hasExistingShop && mode !== "document") {
    const uploadPromise =
      mode === "logo" ? updateShopLogo(file) : updateShopBanner(file);

    toast.promise(uploadPromise, {
      loading: `Syncing ${mode}...`,
      success: (data) =>
        `${mode.charAt(0).toUpperCase() + mode.slice(1)} updated!`,
      error: (err) =>
        `Failed to upload ${mode}: ${err.response?.data?.message || "Server Error"}`,
    });
  }
    setTimeout(() => setUploadingMode(null), 600);
  }; 
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [shopRes, addrRes] = await Promise.all([
          getMyShop().catch(() => null),
          getAddress().catch(() => null),
        ]);

        if (addrRes) {
          setAddressLine(addrRes.street_address || "");
          setCity(addrRes.city || "");
          setPhoneNumber(addrRes.phone || "");
          setCountryCode(addrRes.country || "");
          setStateCode(addrRes.state || "");
          setZip(addrRes.zip_code || "");
          if (addrRes.lat) setLat(Number(addrRes.lat));
          if (addrRes.lng) setLng(Number(addrRes.lng));
        } 
        
        if (shopRes?.status === "success" && shopRes.data) {
          const s = shopRes.data;
          setShopData(s);
          setHasExistingShop(true);
          setName(s.name || "");
          setDescription(s.description || "");
          setLogoUrl(s.logo);
          setBannerUrl(s.banner);
          setIdDocUrl(s.identification_document);
          if (s.identification_type) {
            const matchedId = ID_OPTIONS.find(
              (option) => option.name === s.identification_type,
            );
            setIdentificationType(
              matchedId || { id: 0, name: s.identification_type },
            );
          }

          if (s.local_delivery_setting) {
            const matchedDelivery = LOCALDELIVERYOPTION.find(
              (option) => option.name === s.local_delivery_setting,
            );
            setLocalDelivery(
              matchedDelivery || { id: 0, name: s.local_delivery_setting },
            );
          }

          const foundType = TYPES.find(
            (t) => t.name.toLowerCase() === s.type?.toLowerCase(),
          );
          if (foundType) setSelectedType(foundType);
          if (s.category) setSelectedCategory(s.category);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCats = async () => {
      setCategoriesLoading(true);  
      try {
        const r = await listCategories(
          50,
          0,
          undefined,
          selectedType.name.toLowerCase(),
        );

        if (isMounted) {
          const formatted = (r?.categories ?? []).map((c: any) => ({
            id: c.id,
            name: c.name,
          }));
          setCategories(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Could not load categories for this type.");
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCats();

    return () => {
      isMounted = false;  
    };
  }, [selectedType]);

  if (initialLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <BeatLoader color="#00A85A" />
        <p className="mt-4 text-sm text-slate-500">Syncing...</p>
      </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (description.length > MAX_DESC_LENGTH) {
      return toast.error("Description is too long.");
    }
    if (!name || !description || !phoneNumber || !selectedCategory) {
      return toast.error("Missing required fields.");
    }
    if (!zip || !lat || !lng) {
      return toast.error(
        "Please select a valid address from the dropdown to provide Zip and Coordinates."
      );
    }

    // 2. Prepare FormData
    const form = new FormData();
    form.append("name", name);
    form.append("description", description);
    form.append("phone", phoneNumber);
    form.append("category_id", String(selectedCategory.id));
    form.append("type", selectedType.name.toLowerCase());
    
    // Only append local_delivery_setting if type is 'products'
    if (selectedType.name.toLowerCase() === "products") {
      form.append("local_delivery_setting", localDelivery.name || "");
    }

    form.append("identification_type", identificationType?.name ?? "student");
    
    if (idDocFile) form.append("identification_document", idDocFile);
    if (logoFile) form.append("logo", logoFile);
    if (bannerFile) form.append("banner", bannerFile);
    
    form.append("address", addressLine);
    form.append("city", city);
    form.append("state", stateCode);
    form.append("zip", zip);
    form.append("country", countryCode);
    form.append("lat", String(lat));
    form.append("lng", String(lng));

    // 3. Execution
    setLoading(true);
    try {
      const res = await saveShop(form);
      if (res.status === "success") {
        toast.success("Shop updated!");
        onNext?.();
      }
    } catch (err: any) {
      const errorData = err.response?.data;

      if (errorData?.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstErrorMessage = errorData.errors[firstErrorKey][0];
        toast.error(firstErrorMessage);
      } else if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error("Something went wrong. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl pb-20 mx-auto">
      <ShopHeaderCard
        shop={shopData}
        subtitle={`Managing ${selectedType.name} Profile`}
      />

      <div className="relative mb-24">
        {/* Banner Upload Area */}
        <div className="relative w-full h-56 overflow-hidden border bg-slate-100 rounded-2xl border-slate-200 group">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              className="object-cover w-full h-full"
              alt="Shop Banner"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FaImage className="mb-2 text-4xl opacity-20" />
              <p className="text-sm font-medium">Upload Shop Banner</p>
              <p className="text-[10px]">Recommended: 1200 x 400px (Max 2MB)</p>
            </div>
          )}

          {uploadingMode === "banner" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <BeatLoader size={10} color="#00A85A" />
            </div>
          )}

          <label className="absolute inset-0 z-20 flex items-center justify-center transition opacity-0 cursor-pointer bg-black/10 group-hover:opacity-100">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <FaPencil className="text-hub-secondary" />
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleMediaChange(e.target.files[0], "banner")
              }
            />
          </label>
        </div>

        {/* Logo Upload Area */}
        <div className="absolute -bottom-16 left-10">
          <div className="relative w-32 h-32 overflow-hidden bg-white border-4 border-white rounded-full shadow-xl group/logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                className="object-cover w-full h-full"
                alt="Shop Logo"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-2 text-center bg-slate-50 text-slate-400">
                <FaImage className="mb-1 text-xl opacity-20" />
                <p className="text-[9px] leading-tight font-bold">
                  Upload
                  <br />
                  Logo
                </p>
              </div>
            )}

            {uploadingMode === "logo" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                <BeatLoader size={8} color="#00A85A" />
              </div>
            )}

            <label className="absolute inset-0 z-20 flex items-center justify-center transition opacity-0 cursor-pointer bg-black/40 group-hover/logo:opacity-100">
              <FaPencil className="text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleMediaChange(e.target.files[0], "logo")
                }
              />
            </label>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="">
          <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2">
            <TextInput
              label="Business Name"
              value={name}
              onChange={setName}
              required
            />
            <CategorySelector
              categoriesLoading={categoriesLoading}
              types={TYPES}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isTypeDisabled={hasExistingShop}
            />
          </div>
          {selectedType.name === "Products" && (
            <SelectField
              label="Local Delivery"
              value={localDelivery}
              onChange={(val) => setLocalDelivery(val as SelectOption)}
              options={LOCALDELIVERYOPTION}
            />
          )}
        </section>

        <section className="">
          <h3 className="mb-6 font-bold text-slate-800">Legal Verification</h3>
          <SelectField
            label="ID Type"
            value={identificationType || ID_OPTIONS[0]}
            onChange={(val) => setIdentificationType(val as any)}
            options={ID_OPTIONS}
          />
          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold">
              Upload ID Preview
            </label>
            <div className="relative flex flex-col items-center justify-center h-48 overflow-hidden border bg-slate-200 rounded-xl border-slate-100">
              {idDocUrl ? (
                <img
                  src={idDocUrl}
                  className="object-cover w-full h-full"
                  alt="ID"
                />
              ) : (
                <FaCloudArrowUp className="text-3xl text-slate-300" />
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleMediaChange(e.target.files[0], "document")
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-6 ">
          {googleLoaded && (
            <GoogleAddressAutocomplete
              onSelect={(addr) => {
                setAddressLine(addr.street_address);
                setCity(addr.city);
                setStateCode(addr.state);
                setZip(addr.zip_code);
                setCountryCode(addr.country);
                setLat(addr.lat);
                setLng(addr.lng);
                setDialCode(addr.dialCode ?? "+1");
              }}
            />
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Street Address"
              value={addressLine}
              onChange={setAddressLine}
              placeholder="street / building no"
              required
            />
            <TextInput label="City" value={city} onChange={setCity} disabled />
            <TextInput
              label="Province"
              value={stateCode}
              onChange={setStateCode}
              disabled
            />
            <PhoneInput
              countryFlag={countryCodeToFlag(countryCode)}
              dialCode={dialCode}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>
        </section>

        <div className="relative">
          <TextareaField
            label="Shop Description"
            value={description}
            onChange={setDescription}
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-bold btn btn-primary rounded-xl"
        >
          {loading ? <BeatLoader size={8} color="white" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
