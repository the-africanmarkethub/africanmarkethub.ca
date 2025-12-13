"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useCreateShop } from "@/hooks/useShop";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";

export default function CreateShopPage() {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const { isAuthenticated, user } = useAuthGuard();
  const createShop = useCreateShop();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "" as "products" | "services" | "",
    description: "",
    subscription_id: "",
    state_id: "",
    city_id: "",
    country_id: "",
    category_id: "",
    billing_cycle: "" as "monthly" | "yearly" | "",
  });

  const [files, setFiles] = useState({
    logo: null as File | null,
    banner: null as File | null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    logo: null as string | null,
    banner: null as string | null,
  });

  // All data fetching hooks must be called unconditionally
  const { data: subscriptionsData, isLoading: subscriptionsLoading } =
    useSubscriptions();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(
    (formData.type as "products" | "services") || "products"
  );
  const { data: locationsData, isLoading: locationsLoading } = useLocations();

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviews.logo) {
        URL.revokeObjectURL(imagePreviews.logo);
      }
      if (imagePreviews.banner) {
        URL.revokeObjectURL(imagePreviews.banner);
      }
    };
  }, [imagePreviews]);

  // ALL CONDITIONAL LOGIC AND EARLY RETURNS AFTER HOOKS
  // If not authenticated, show login required message
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in as a customer to create a vendor shop.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center bg-[#F28C0D] hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset dependent dropdowns when parent changes
      ...(name === "type" && { category_id: "" }),
      ...(name === "country_id" && { state_id: "", city_id: "" }),
      ...(name === "state_id" && { city_id: "" }),
    }));
  };

  // Get filtered data based on selections
  const selectedCountry = locationsData?.data?.find(
    (country) => country.id.toString() === formData.country_id
  );
  const availableStates = selectedCountry?.state || [];
  const selectedState = availableStates.find(
    (state) => state.id.toString() === formData.state_id
  );
  const availableCities =
    selectedCountry?.city?.filter(
      (city) => city.state_id.toString() === formData.state_id
    ) || [];

  const handleTypeSelect = (type: "products" | "services") => {
    setFormData((prev) => ({ ...prev, type }));
    setShowTypeDropdown(false);
  };

  const handleFileChange =
    (type: "logo" | "banner") => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error(
            `${type} must be a valid image file (JPEG, PNG, GIF, WebP)`
          );
          e.target.value = ""; // Reset the input
          return;
        }

        // Validate file size (1MB)
        if (file.size > 1048576) {
          toast.error(`${type} file size must be less than 1MB`);
          e.target.value = ""; // Reset the input
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        setFiles((prev) => ({ ...prev, [type]: file }));
        setImagePreviews((prev) => ({ ...prev, [type]: previewUrl }));
        toast.success(`${type} uploaded successfully!`);
      }
    };

  const validateStep1 = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Business name is required");
    if (!formData.address.trim()) errors.push("Business address is required");
    if (!formData.type) errors.push("Business type is required");
    if (!formData.description.trim())
      errors.push("Business description is required");

    if (formData.name.trim().length < 2)
      errors.push("Business name must be at least 2 characters");
    if (formData.description.trim().length < 10)
      errors.push("Business description must be at least 10 characters");

    return errors;
  };

  const validateStep2 = () => {
    const errors: string[] = [];

    if (!formData.category_id) errors.push("Please select a category");
    if (!formData.subscription_id)
      errors.push("Please select a subscription plan");
    if (!formData.billing_cycle) errors.push("Please select a billing cycle");
    if (!formData.country_id) errors.push("Please select a country");
    if (!formData.state_id) errors.push("Please select a state");
    if (!formData.city_id) errors.push("Please select a city");
    if (!files.logo) errors.push("Please upload a business logo");
    if (!files.banner) errors.push("Please upload a business banner");

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep1();

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateStep2();

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    const payload = {
      name: formData.name,
      address: formData.address,
      type: formData.type as "products" | "services",
      description: formData.description,
      subscription_id: formData.subscription_id,
      state_id: formData.state_id,
      city_id: formData.city_id,
      country_id: formData.country_id,
      category_id: formData.category_id,
      billing_cycle: formData.billing_cycle as "monthly" | "yearly",
      logo: files.logo!,
      banner: files.banner!,
    };

    createShop.mutate(payload, {
      onSuccess: (data) => {
        toast.success("Shop created successfully!");
        router.push("/vendor/dashboard");
      },
      onError: (error: any) => {
        console.error("Shop creation error:", error);

        if (error?.errors) {
          const apiErrors = error.errors;
          Object.keys(apiErrors).forEach((field) => {
            const messages = apiErrors[field];
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => {
                toast.error(`${field}: ${message}`);
              });
            } else if (typeof messages === "string") {
              toast.error(`${field}: ${messages}`);
            }
          });
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to create shop. Please try again.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/icon/shopCreate.svg"
          alt="Create Shop"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/icon/logo.svg"
              alt="African Market Hub"
              width={200}
              height={67}
              className="h-12 w-auto mx-auto"
            />
          </div>

          <div className="">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Your Vendor Account
            </h1>

            {step === 1 ? (
              // Step 1: Basic Information
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Business Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Business Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Type
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-left flex justify-between items-center"
                  >
                    <span
                      className={
                        formData.type ? "text-gray-700" : "text-gray-400"
                      }
                    >
                      {formData.type === "products"
                        ? "Products"
                        : formData.type === "services"
                        ? "Service"
                        : "Business Type"}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showTypeDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <button
                        type="button"
                        onClick={() => handleTypeSelect("products")}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeSelect("services")}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 border-t border-gray-100"
                      >
                        Service
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Business Address"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors resize-vertical text-gray-700"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#F28C0D] hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#F28C0D] hover:text-orange-600 font-medium"
                  >
                    Login
                  </Link>
                </div>
              </form>
            ) : (
              // Step 2: Complete Shop Setup
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                    disabled={categoriesLoading || !formData.type}
                  >
                    <option value="">Select Category</option>
                    {categoriesData?.categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoriesLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      Loading categories...
                    </p>
                  )}
                  {!formData.type && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select business type first
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subscription_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subscription
                  </label>
                  <select
                    id="subscription_id"
                    name="subscription_id"
                    value={formData.subscription_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                    disabled={subscriptionsLoading}
                  >
                    <option value="">Select Subscription</option>
                    {subscriptionsData?.data?.map((subscription) => (
                      <option key={subscription.id} value={subscription.id}>
                        {subscription.name}
                      </option>
                    ))}
                  </select>
                  {subscriptionsLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      Loading subscriptions...
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="billing_cycle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Billing Cycle
                  </label>
                  <select
                    id="billing_cycle"
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                  >
                    <option value="">Select Billing Cycle</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="country_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country_id"
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                    disabled={locationsLoading}
                  >
                    <option value="">Select Country</option>
                    {locationsData?.data?.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {locationsLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      Loading countries...
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <select
                    id="state_id"
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                    disabled={
                      !formData.country_id || availableStates.length === 0
                    }
                  >
                    <option value="">Select State</option>
                    {availableStates.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {!formData.country_id && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select country first
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <select
                    id="city_id"
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-700"
                    required
                    disabled={
                      !formData.state_id || availableCities.length === 0
                    }
                  >
                    <option value="">Select City</option>
                    {availableCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {!formData.state_id && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select state first
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Logo
                  </label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#F28C0D] transition-colors"
                  >
                    {imagePreviews.logo ? (
                      <div className="relative">
                        <Image
                          src={imagePreviews.logo}
                          alt="Business Logo Preview"
                          width={80}
                          height={80}
                          className="mx-auto object-cover rounded-lg"
                        />
                        <div className="mt-2">
                          <p className="text-gray-600 text-xs">
                            {files.logo?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to change
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600">
                          Choose files or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">Image (1MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange("logo")}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Banner
                  </label>
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#F28C0D] transition-colors"
                  >
                    {imagePreviews.banner ? (
                      <div className="relative">
                        <Image
                          src={imagePreviews.banner}
                          alt="Business Banner Preview"
                          width={200}
                          height={80}
                          className="mx-auto object-cover rounded-lg"
                        />
                        <div className="mt-2">
                          <p className="text-gray-600 text-xs">
                            {files.banner?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to change
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600">
                          Choose files or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">Image (1MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange("banner")}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-[#F28C0D] border-gray-300 rounded focus:ring-[#F28C0D]"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    By creating an account you agree to our{" "}
                    <Link
                      href="/market-hub/terms"
                      className="text-[#F28C0D] hover:text-orange-600 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/market-hub/privacy"
                      className="text-[#F28C0D] hover:text-orange-600 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={createShop.isPending}
                  className="w-full bg-[#F28C0D] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {createShop.isPending ? "Creating Shop..." : "Create Shop"}
                </button>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
