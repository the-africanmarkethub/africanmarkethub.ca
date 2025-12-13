"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartItems } from "@/hooks/useCart";
import { useAddresses, useCreateAddress } from "@/hooks/useAddress";
import { useShippingRates } from "@/hooks/useShipping";
import { useCheckout } from "@/hooks/useCheckout";
import { Country, State, City } from "country-state-city";

// Address form schema matching API payload
const addressSchema = yup.object({
  street_address: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required").min(1, "State is required"),
  zip_code: yup.string().required("Zip code is required"),
  country: yup
    .string()
    .required("Country is required")
    .min(1, "Country is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

type AddressFormData = yup.InferType<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading } = useCartItems();
  const { data: addressesData } = useAddresses();
  const createAddress = useCreateAddress();
  const checkout = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("CA"); // Default to Canada
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "CA",
      phone: "",
    },
  });

  // Auto-select first address if available
  useEffect(() => {
    if (
      addressesData?.data &&
      addressesData.data.length > 0 &&
      !selectedAddressId
    ) {
      setSelectedAddressId(addressesData.data[0].id);
    }
  }, [addressesData, selectedAddressId]);

  // Show form if no addresses exist
  useEffect(() => {
    if (addressesData?.data && addressesData.data.length === 0) {
      setShowNewAddressForm(true);
    }
  }, [addressesData]);

  // Get location data using country-state-city package
  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountryCode);
  const cities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  // Get selected address for shipping calculation
  const selectedAddress = addressesData?.data?.find(
    (addr) => addr.id === selectedAddressId
  );

  // Get user data for shipping calculation
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  // Prepare shipping payload when address is selected
  const shippingPayload =
    selectedAddress && cartData?.data
      ? {
          to_name: userData.name || "",
          to_lastname: userData.last_name || "",
          to_email: userData.email || "",
          to_phone: selectedAddress.phone,
          to_street: selectedAddress.street_address,
          to_city: selectedAddress.city,
          to_state: selectedAddress.state,
          to_zip: selectedAddress.zip_code,
          to_country: selectedAddress.country,
          products: cartData.data.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
          })),
        }
      : null;

  // Get shipping rates when address is selected
  const { data: shippingRates, isLoading: shippingLoading } = useShippingRates(
    shippingPayload,
    !!selectedAddress && !!cartData?.data
  );

  const calculateTotals = () => {
    if (!cartData?.data)
      return {
        subtotal: 0,
        shipping: 0,
        tax: 50.15,
        total: 0,
        deliveryDays: "",
      };

    const subtotal = cartData.data.reduce((sum, item) => {
      return sum + (parseFloat(item.subtotal) || 0);
    }, 0);

    // Use dynamic shipping rate or fallback
    const shipping = shippingRates?.rates?.total || 0;
    const deliveryDays =
      shippingRates?.rates?.delivery_days || "2-3 business days";
    const tax = 50.15;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total, deliveryDays };
  };

  const { subtotal, shipping, tax, total, deliveryDays } = calculateTotals();

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!cartData?.data || cartData.data.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderItemIds = cartData.data.map((item) => item.id);

    toast.loading("Processing your order...", { id: "place-order" });

    checkout.mutate(
      {
        order_item_id: orderItemIds,
        address_id: selectedAddressId,
      },
      {
        onSuccess: (response) => {
          toast.dismiss("place-order");
          if (response.message) {
            toast.success(response.message);
          } else {
            toast.success("Order placed successfully!");
          }

          // Handle payment link if provided
          if (response.payment_link) {
            window.open(response.payment_link, "_blank");
            // Redirect to cart page after opening payment window
            router.push("/cart");
          }
        },
        onError: (error: any) => {
          toast.dismiss("place-order");
          console.error("Checkout failed:", error);

          if (error?.errors) {
            Object.keys(error.errors).forEach((field) => {
              const messages = error.errors[field];
              if (Array.isArray(messages)) {
                messages.forEach((message: string) => toast.error(message));
              }
            });
          } else if (error?.message) {
            toast.error(error.message);
          } else {
            toast.error("Failed to place order. Please try again.");
          }
        },
      }
    );
  };

  const onSubmitAddress = (data: AddressFormData) => {
    console.log("onSubmitAddress called with data:", data);
    console.log("Form errors:", errors);
    console.log("CreateAddress hook state:", {
      isPending: createAddress.isPending,
      isError: createAddress.isError,
    });

    // Add loading toast to show something is happening
    toast.loading("Saving address...", { id: "save-address" });

    createAddress.mutate(data, {
      onSuccess: (response) => {
        toast.dismiss("save-address");
        toast.success(response.message || "Address saved successfully!");
        setShowNewAddressForm(false);
        console.log("Address created successfully:", response);
      },
      onError: (error: any) => {
        toast.dismiss("save-address");
        console.error("Address creation error:", error);

        if (error?.errors) {
          Object.keys(error.errors).forEach((field) => {
            const messages = error.errors[field];
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => toast.error(message));
            }
          });
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to save address. Please try again.");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#F28C0D]">
              Home
            </Link>
            <span>›</span>
            <Link href="/cart" className="hover:text-[#F28C0D]">
              Cart
            </Link>
            <span>›</span>
            <span className="text-gray-900">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>

              {/* Existing Addresses */}
              {addressesData?.data &&
                addressesData.data.length > 0 &&
                !showNewAddressForm && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-gray-900">
                      Select Address
                    </h3>
                    {addressesData.data.map((address) => (
                      <label
                        key={address.id}
                        className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#F28C0D]"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 text-[#F28C0D] focus:ring-[#F28C0D]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {address.address_label || "Address"}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.street_address}, {address.city},{" "}
                            {address.state} {address.zip_code},{" "}
                            {address.country}
                          </div>
                          <div className="text-sm text-gray-600">
                            Phone: {address.phone}
                          </div>
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="text-[#F28C0D] text-sm hover:underline"
                    >
                      + Add new address
                    </button>
                  </div>
                )}

              {/* Address Form */}
              {(showNewAddressForm ||
                !addressesData?.data ||
                addressesData.data.length === 0) && (
                <form
                  onSubmit={(e) => {
                    console.log("Form onSubmit triggered");
                    console.log("Current form validation errors:", errors);
                    handleSubmit(
                      (data) => {
                        console.log("Form validation passed, data:", data);
                        onSubmitAddress(data);
                      },
                      (validationErrors) => {
                        console.log(
                          "Form validation failed, detailed errors:",
                          validationErrors
                        );
                        Object.keys(validationErrors).forEach((field) => {
                          console.log(
                            `Field "${field}" error:`,
                            (validationErrors as any)[field]?.message
                          );
                        });
                      }
                    )(e);
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <Controller
                      name="street_address"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Your Street Address"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                        />
                      )}
                    />
                    {errors.street_address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street_address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => {
                          setSelectedCountryCode(e.target.value);
                          setSelectedStateCode(""); // Reset state when country changes
                          setValue("country", e.target.value);
                          setValue("state", "");
                          setValue("city", "");
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                      >
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <select
                        value={selectedStateCode}
                        onChange={(e) => {
                          setSelectedStateCode(e.target.value);
                          setValue("state", e.target.value);
                          setValue("city", "");
                        }}
                        disabled={!selectedCountryCode}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900 disabled:bg-gray-100"
                      >
                        <option value="">Select State</option>
                        {states?.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <Controller
                        name="zip_code"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="12093"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                          />
                        )}
                      />
                      {errors.zip_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.zip_code.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          disabled={!selectedStateCode}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900 disabled:bg-gray-100"
                        >
                          <option value="">Select City</option>
                          {cities?.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="text-lg">🇨🇦</span>
                          </div>
                          <input
                            {...field}
                            type="tel"
                            placeholder="(123) 456-7890"
                            maxLength={14}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) {
                                if (value.length >= 6) {
                                  value = `(${value.slice(0, 3)}) ${value.slice(
                                    3,
                                    6
                                  )}-${value.slice(6)}`;
                                } else if (value.length >= 3) {
                                  value = `(${value.slice(0, 3)}) ${value.slice(
                                    3
                                  )}`;
                                }
                                field.onChange(value.replace(/[^\d]/g, "")); // Store only digits
                              }
                            }}
                          />
                        </div>
                      )}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={createAddress.isPending}
                      className="bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                      onClick={() => console.log("Save Address button clicked")}
                    >
                      {createAddress.isPending ? "Saving..." : "Save Address"}
                    </button>

                    {addressesData?.data && addressesData.data.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Cart Items Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>

              <div className="space-y-4">
                {cartData?.data?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/icon/auth.svg"}
                        alt={item.product.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product.title} x{item.quantity}
                      </h4>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${parseFloat(item.subtotal).toFixed(2)} CAD
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)} CAD</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span>Shipping Fee:</span>
                    {shippingRates?.rates && (
                      <span className="text-xs text-gray-500">
                        {shippingRates.rates.postage_type} ({deliveryDays})
                      </span>
                    )}
                  </div>
                  <span className="font-medium">
                    {shippingLoading ? (
                      <span className="text-xs">Calculating...</span>
                    ) : (
                      `$${shipping.toFixed(2)} CAD`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-3">
                  <span>Coupon</span>
                  <button className="text-[#F28C0D] text-sm hover:underline">
                    + Add Coupon
                  </button>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)} CAD</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || checkout.isPending}
                className="w-full mt-6 bg-[#F28C0D] text-white py-3 rounded-full font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {checkout.isPending ? "Processing..." : "Place Order"}
              </button>
            </div>

            {/* Payment Methods */}
            {/* <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Payment Method
              </h3>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#F28C0D] focus:ring-[#F28C0D]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Direct bank transfer
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Direct bank transfer, also known as a wire transfer, is a
                      secure electronic method for moving funds between bank
                      accounts.
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#F28C0D] focus:ring-[#F28C0D]"
                  />
                  <div className="font-medium text-gray-900">Stripe</div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-[#F28C0D] focus:ring-[#F28C0D]"
                  />
                  <div className="font-medium text-gray-900">PayPal</div>
                </label>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#F28C0D] hover:underline"
                >
                  privacy policy
                </Link>
                .
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .phone-input-custom {
          display: flex !important;
        }
        .phone-input-custom .PhoneInputInput {
          width: 100% !important;
          padding: 0.75rem 1rem !important;
          border: 1px solid #e5e7eb !important;
          border-left: none !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          font-size: 1rem !important;
          outline: none !important;
          transition: border-color 0.2s !important;
          background-color: white !important;
          color: #1f2937 !important;
        }
        .phone-input-custom .PhoneInputInput:focus {
          border-color: #f28c0d !important;
          box-shadow: 0 0 0 1px #f28c0d !important;
        }
        .phone-input-custom .PhoneInputCountrySelect {
          border: 1px solid #e5e7eb !important;
          border-right: none !important;
          border-radius: 0.5rem 0 0 0.5rem !important;
          padding: 0.75rem 0.5rem !important;
          background-color: white !important;
        }
        .phone-input-custom .PhoneInputCountrySelect:focus {
          border-color: #f28c0d !important;
          box-shadow: 0 0 0 1px #f28c0d !important;
        }
      `}</style>
    </div>
  );
}
