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
      const uploadFn =
        mode === "logo" ? updateShopLogo(file) : updateShopBanner(file);
      toast.promise(uploadFn, {
        loading: `Syncing ${mode}...`,
        success: `${mode} updated!`,
        error: `Failed to upload ${mode}.`,
      });
    }
    setTimeout(() => setUploadingMode(null), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length > MAX_DESC_LENGTH)
      return toast.error("Description is too long.");
    if (!name || !description || !phoneNumber || !selectedCategory)
      return toast.error("Missing required fields.");
    if (!zip || !lat || !lng) {
      return toast.error(
        "Please select a valid address from the dropdown to provide Zip and Coordinates.",
      );
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("phone", phoneNumber);
      form.append("category_id", String(selectedCategory.id));
      form.append("type", selectedType.name.toLowerCase());
      form.append("local_delivery_setting", localDelivery.name || "");
      form.append("identification_type", identificationType?.name || "");

      if (idDocFile) form.append("identification_document", idDocFile);
      if (logoFile) form.append("logo", logoFile);
      if (bannerFile) form.append("banner", bannerFile);
      form.append("address", addressLine);
      form.append("city", city);
      form.append("state", stateCode);
      form.append("zip", zip);
      form.append("country", countryCode);
      form.append("lat", String(lat)); // Ensure these are strings in FormData
      form.append("lng", String(lng));

      const res = await saveShop(form);
      if (res.status === "success") {
        toast.success("Shop updated!");
        onNext?.();
      }
  } catch (err: any) {
  console.log("Full Error Object:", err.response?.data);

  const errorData = err.response?.data;

  // 1. Handle Laravel Validation Errors (Objects)
  if (errorData?.errors) {
    const firstErrorKey = Object.keys(errorData.errors)[0];
    const firstErrorMessage = errorData.errors[firstErrorKey][0];
    toast.error(firstErrorMessage); // Shows "The phone field is required" etc.
  } 
  // 2. Handle Custom Backend Messages
  else if (errorData?.message) {
    toast.error(errorData.message);
  } 
  else {
    toast.error("Something went wrong. Please check your inputs.");
  }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [shopRes, addrRes] = await Promise.all([
          getMyShop().catch(() => null),
          getAddress().catch(() => null),
        ]);

        // 1. Set fallback values from general address first
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

        // 2. OVERWRITE with specific Shop data if it exists
        // This ensures shop-specific location takes priority over profile address
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
      setCategoriesLoading(true); // Start loading
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
      isMounted = false; // Cleanup to prevent memory leaks/race conditions
    };
  }, [selectedType]);

  if (initialLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <BeatLoader color="#00A85A" />
        <p className="text-sm text-slate-500 mt-4">Syncing...</p>
      </div>
    );

  return (
    <div className="mx-auto pb-20 max-w-6xl">
      <ShopHeaderCard
        shop={shopData}
        subtitle={`Managing ${selectedType.name} Profile`}
      />

      <div className="relative mb-24">
        {/* Banner Upload Area */}
        <div className="w-full h-56 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              className="w-full h-full object-cover"
              alt="Shop Banner"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FaImage className="text-4xl mb-2 opacity-20" />
              <p className="text-sm font-medium">Upload Shop Banner</p>
              <p className="text-[10px]">Recommended: 1200 x 400px (Max 2MB)</p>
            </div>
          )}

          {uploadingMode === "banner" && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <BeatLoader size={10} color="#00A85A" />
            </div>
          )}

          <label className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer z-20">
            <div className="bg-white p-3 rounded-full shadow-lg">
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
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative group/logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                className="w-full h-full object-cover"
                alt="Shop Logo"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400 p-2 text-center">
                <FaImage className="text-xl mb-1 opacity-20" />
                <p className="text-[9px] leading-tight font-bold">
                  Upload
                  <br />
                  Logo
                </p>
              </div>
            )}

            {uploadingMode === "logo" && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <BeatLoader size={8} color="#00A85A" />
              </div>
            )}

            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition flex items-center justify-center cursor-pointer z-20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-6">
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
          <h3 className="font-bold mb-6 text-slate-800">Legal Verification</h3>
          <SelectField
            label="ID Type"
            value={identificationType || ID_OPTIONS[0]}
            onChange={(val) => setIdentificationType(val as any)}
            options={ID_OPTIONS}
          />
          <div className="mt-4">
            <label className="text-sm font-semibold mb-2 block">
              Upload ID Preview
            </label>
            <div className="relative h-48 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center overflow-hidden">
              {idDocUrl ? (
                <img
                  src={idDocUrl}
                  className="w-full h-full object-cover"
                  alt="ID"
                />
              ) : (
                <FaCloudArrowUp className="text-slate-300 text-3xl" />
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

        <section className=" space-y-6">
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
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
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
          className="btn btn-primary w-full py-4 rounded-xl font-bold"
        >
          {loading ? <BeatLoader size={8} color="white" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
