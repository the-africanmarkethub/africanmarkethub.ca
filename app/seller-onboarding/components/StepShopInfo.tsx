"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { FaFilePdf, FaPencil } from "react-icons/fa6";

import { listCategories } from "@/lib/api/category";
import {
  getMyShop,
  saveShop,
  updateShopLogo,
  updateShopBanner,
} from "@/lib/api/seller/shop";
import { numverifyValidatePhone } from "@/lib/api/ip/route";
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
import FadeSlide from "@/app/(seller)/dashboard/shop-management/components/FadeSlide";

export interface Option extends DefaultOption {}

interface SelectOption {
  id: number;
  name: string;
  label?: string;
  code?: string;
  flag?: string;
  dial_code?: string;
}

const TYPES: SelectOption[] = [
  { id: 3, name: "Products", label: "Product Merchant" },
  { id: 2, name: "Services", label: "Service Provider" },
  { id: 1, name: "Deliveries", label: "Delivery Partner" },
];

export default function StepShopInfo({ onNext }: StepProps) {
  // --- Internal Persistence Flag ---
  const [hasExistingShop, setHasExistingShop] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zip, setZip] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);
  const [isValidatingPhone, setIsValidatingPhone] = useState(false);
  const [dialCode, setDialCode] = useState("");

  const [identificationType, setIdentificationType] = useState<Option | null>(
    null,
  );
  const [idDocUrl, setIdDocUrl] = useState<string | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);

  const ID_OPTIONS: Option[] = [
    { id: 1, name: "Work permit" },
    { id: 2, name: "Study permit" },
    { id: 3, name: "Permanent resident" },
    { id: 4, name: "Passport for citizen" },
  ];

  const validatePhoneNumber = useCallback(async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      setIsPhoneValid(null);
      return;
    }
    setIsValidatingPhone(true);
    try {
      const fullNumber = `${phoneNumber}`;
      const data = await numverifyValidatePhone({
        number: fullNumber,
        countryCode: countryCode ?? "",
      });
      setIsPhoneValid(data.valid === true);
    } catch (err) {
      setIsPhoneValid(false);
    } finally {
      setIsValidatingPhone(false);
    }
  }, [phoneNumber, countryCode]);

  useEffect(() => {
    const timer = setTimeout(() => validatePhoneNumber(), 600);
    return () => clearTimeout(timer);
  }, [phoneNumber, validatePhoneNumber]);

  useEffect(() => {
    let isMounted = true;
    const loadAccountData = async () => {
      try {
        const [shopRes, addrRes] = await Promise.all([
          getMyShop().catch(() => null),
          getAddress().catch(() => null),
        ]);

        if (!isMounted) return;

        if (shopRes?.status === "success" && shopRes.data) {
          const s = shopRes.data;
          setHasExistingShop(true);
          setName(s.name || "");
          if (s.type) {
            const foundType = TYPES.find(
              (t) => t.name.toLowerCase() === s.type.toLowerCase(),
            );
            if (foundType) setSelectedType(foundType);
          }
          setDescription(s.description || "");
          if (s.identification_type) {
            const found = ID_OPTIONS.find(
              (opt) => opt.name === s.identification_type,
            );
            if (found) setIdentificationType(found);
          }
          setIdDocUrl(s.identification_document);
          setLogoUrl(s.logo);
          setBannerUrl(s.banner);
          if (s.category) setSelectedCategory(s.category);
        }

        if (addrRes) {
          setAddressLine(addrRes.street_address || "");
          setCity(addrRes.city || "");
          setPhoneNumber(addrRes.phone || "");
          setZip(addrRes.zip_code || "");
          setCountryCode(addrRes.country || "");
          setStateCode(addrRes.state || "");
          setLat(addrRes.lat);
          setLng(addrRes.lng);
        }
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };
    loadAccountData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadCats = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const r = await listCategories(
          50,
          0,
          undefined,
          selectedType.name.toLowerCase(),
        );
        if (cancelled) return;
        const formatted = (r?.categories ?? []).map((c: any) => ({
          id: c.id,
          name: c.name,
        }));
        setCategories(formatted);
        setSelectedCategory((prev: any) => {
          if (!prev) return formatted[0] ?? null;
          const keep = formatted.find((f: Option) => f.id === prev.id);
          return keep ?? formatted[0] ?? null;
        });
      } catch (err) {
        console.error(err);
        setCategoriesError("Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCats();
    return () => {
      cancelled = true;
    };
  }, [selectedType]);

  const handleMediaChange = async (file: File, mode: "logo" | "banner") => {
    const localPreview = URL.createObjectURL(file);
    mode === "logo" ? setLogoUrl(localPreview) : setBannerUrl(localPreview);

    if (hasExistingShop) {
      const uploadPromise =
        mode === "logo" ? updateShopLogo(file) : updateShopBanner(file);

      toast.promise(uploadPromise, {
        loading: `Uploading your ${mode}...`,
        success: (res) => {
          if (res.status !== "success") throw new Error(res.message);
          return `${mode} updated!`;
        },
        error: (err) => `Upload failed: ${err.message || "Unknown error"}`,
      });
    }
  };

  const isPdf =
    idDocUrl?.includes("data:application/pdf") ||
    idDocUrl?.toLowerCase().endsWith(".pdf");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Basic Field Validation
    if (!name.trim()) return toast.error("Shop name is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!phoneNumber.trim()) return toast.error("Phone number is required");
    if (!selectedCategory?.id) return toast.error("Please select a category");

    // 2. Conditional Validation (Services)
    if (selectedType.name === "Services") {
      if (!identificationType?.name) {
        return toast.error("Identification type is required for Services");
      }
      if (!idDocFile) {
        return toast.error("Please upload an identification document");
      }
    }

    // 3. Address Validation
    if (!addressLine) return toast.error("Address is required");
    if (!city) return toast.error("City is required");
    if (!stateCode) return toast.error("State is required");
    if (!countryCode) return toast.error("Country is required");

    setLoading(true);
    setErrorMsg("");

    try {
      const form = new FormData();
      // Required Fields
      form.append("name", name);
      form.append("description", description);
      form.append("phone", phoneNumber);
      form.append("category_id", String(selectedCategory?.id));
      form.append("type", selectedType.name.toLowerCase());
      if (selectedType.name === "Services") {
        form.append("identification_type", identificationType?.name || "");
        if (idDocFile) {
          form.append("identification_document", idDocFile);
        }
      }
      // Address Data
      form.append("address", addressLine);
      form.append("city", city);
      form.append("state", stateCode);
      form.append("zip", zip);
      form.append("country", countryCode);

      if (lat !== undefined) form.append("lat", String(lat));
      if (lng !== undefined) form.append("lng", String(lng));

      const res = await saveShop(form);

      if (res.status === "success") {
        toast.success(hasExistingShop ? "Shop updated!" : "Shop created!");
        onNext?.();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    if ((window.google as any)?.maps?.places) {
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

  const handleAddressSelect = (addr: {
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    lat?: number;
    lng?: number;
    dialCode?: string;
  }) => {
    setAddressLine(addr.street_address);
    setCity(addr.city);
    setStateCode(addr.state);
    setZip(addr.zip_code);
    setCountryCode(addr.country);
    setLat(addr.lat);
    setLng(addr.lng);
    setDialCode(addr.dialCode ?? "");
  };

  if (initialLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <BeatLoader color="#00A85A" />
        <p className="text-sm text-gray-500 mt-4">Syncing vendor profile...</p>
      </div>
    );

  return (
    <div className=" mx-auto pb-20">
      <ShopHeaderCard subtitle="Your identity on the platform. Keep your info up to date." />

      {/* Visual Identity Section */}
      <div className="relative mb-24">
        <div className="w-full h-52 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group relative">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              className="w-full h-full object-cover"
              alt="Banner"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No Banner Uploaded
            </div>
          )}
          <label className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <FaPencil className="text-hub-secondary" />
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleMediaChange(e.target.files[0], "banner")
              }
            />
          </label>
        </div>

        <div className="absolute -bottom-16 left-10 group/logo">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative">
            {logoUrl ? (
              <img
                src={logoUrl}
                className="w-full h-full object-cover"
                alt="Logo"
              />
            ) : (
              <div className="h-full bg-slate-50" />
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
              <FaPencil className="text-white" />
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleMediaChange(e.target.files[0], "logo")
                }
              />
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <TextInput
            label="Official Shop Name"
            value={name}
            onChange={setName}
            required
          />
          <CategorySelector
            types={TYPES}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoriesError={categoriesError}
            isTypeDisabled={hasExistingShop}
          />
        </section>

        {/* --- Identification Section --- */}
        <section className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            Legal Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-start">
            {/* Identification Type Dropdown */}
            <div className="space-y-2">
              <SelectField
                label="Identification Type"
                value={identificationType || ID_OPTIONS[0]}
                onChange={(val) => setIdentificationType(val as any)}
                options={ID_OPTIONS.map((opt) => ({
                  id: opt.id,
                  name: opt.name,
                }))}
              />
            </div>

            {/* Identification Document Upload & Preview */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Upload {identificationType?.name || ID_OPTIONS[0].name}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative group w-full h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                {idDocUrl ? (
                  <div className="relative w-full h-full">
                    {isPdf ? (
                      /* PDF Placeholder: Green background with File Name */
                      <div className="w-full h-full bg-emerald-50 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                          <FaFilePdf className="text-white text-3xl" />
                        </div>
                        <p className="text-emerald-900 font-bold text-sm truncate max-w-[80%]">
                          {idDocFile?.name || "Document Uploaded"}
                        </p>
                        <p className="text-emerald-600 text-xs mt-1 uppercase tracking-widest font-semibold">
                          Ready to Save
                        </p>
                      </div>
                    ) : (
                      /* Image Preview - fills the box */
                      <img
                        src={idDocUrl}
                        className="w-full h-full object-cover"
                        alt="ID Preview"
                      />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                        <FaPencil className="text-white" />
                      </div>
                      <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-black/20">
                        Change Document
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center p-4">
                    <div className="bg-white p-3 rounded-full shadow-sm mx-auto mb-2 w-fit">
                      <FaPencil className="text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Click to upload document
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">
                      PNG, JPG or PDF
                    </p>
                  </div>
                )}

                {/* Hidden Input Layer */}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-30"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIdDocFile(file);
                      if (idDocUrl) URL.revokeObjectURL(idDocUrl);
                      setIdDocUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            Operational Address
          </h3>
          <FadeSlide keyId="address">
            {googleLoaded && (
              <GoogleAddressAutocomplete onSelect={handleAddressSelect} />
            )}
          </FadeSlide>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
            <TextInput label="City" value={city} onChange={setCity} disabled />

            <TextInput
              label="Postal Code"
              value={zip}
              onChange={setZip}
              disabled
            />
            <TextInput
              label="Province"
              value={stateCode}
              onChange={setStateCode}
              disabled
            />
            <TextInput
              label="Street Address"
              value={addressLine}
              onChange={setAddressLine}
              placeholder="street / building no"
              required
            />
          </div>

          <PhoneInput
            countryFlag={countryCodeToFlag(countryCode)}
            dialCode={dialCode ?? ""}
            value={phoneNumber}
            onChange={setPhoneNumber}
            validating={isValidatingPhone}
            valid={isPhoneValid}
          />
        </section>

        <TextareaField
          label="About the Shop"
          value={description}
          onChange={setDescription}
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary gap-3 w-full"
        >
          {loading ? (
            <BeatLoader size={8} color="white" />
          ) : hasExistingShop ? (
            "Update Shop Profile"
          ) : (
            "Create & Continue"
          )}
        </button>
      </form>
    </div>
  );
}
