"use client";

import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../carts/components/Summary";
import Address from "@/interfaces/address";
import { shippingRate } from "@/lib/api/customer/shippingRate";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { ShippingRateResponse } from "@/interfaces/shippingRate";
import { useAuthStore } from "@/store/useAuthStore";
import TextInput from "../(seller)/dashboard/shop-management/components/TextInput";
import AppointmentPicker from "./components/AppointmentPicker";
import GoogleAddressAutocomplete from "../(seller)/dashboard/shop-management/components/GoogleAddressAutocomplete";
import { countryCodeToFlag } from "@/utils/countryFlag";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuthStore(); // get logged-in user

  const [userIP] = useState<string>("178.238.11.6");
  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] =
    useState<ShippingRateResponse | null>(null);
  const [shippingFee, setShippingFee] = useState(0);

  const [address, setAddress] = useState<Address>({
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    address_label: "",
    dialCode: "",
    country: "",
  });

  const [firstname, setFirstname] = useState(user?.name || "");
  const [lastname, setLastname] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [serviceNote, setServiceNote] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const isServiceOrder = useMemo(() => {
    return cart.some((item) => item.type === "services");
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!firstname.trim()) {
      return toast.error("First name is required");
    }
    if (!lastname.trim()) {
      return toast.error("Last name is required");
    }
    if (!email.trim()) {
      return toast.error("Email is required");
    }
    if (!phone.trim()) {
      return toast.error("Phone number is required");
    }

    if (!isServiceOrder) {
      if (!address.street_address.trim()) {
        return toast.error("Street address is required");
      }
      if (!address.city.trim()) {
        return toast.error("City is required");
      }
      if (!address.state.trim()) {
        return toast.error("State is required");
      }
      if (!address.zip_code.trim()) {
        return toast.error("Postal code is required");
      }
      if (!address.country.trim()) {
        return toast.error("Country is required");
      }
    } else {
      if (!serviceNote.trim()) {
        return toast.error("Service note is required");
      }
      if (!preferredDate.trim()) {
        return toast.error("Preferred date is required");
      }
    }

    const basePayload = {
      firstname,
      lastname,
      email,
      phone,
      country: address.country || "CA",
      products: cart.map((item) => ({
        id: item.id,
        quantity: item.qty,
      })),
    };

    const payload = isServiceOrder
      ? {
          ...basePayload,
          note: serviceNote,
          preferred_date: preferredDate,
          type: "services",
        }
      : {
          ...basePayload,
          street: address.street_address,
          city: address.city,
          state: address.state,
          zip: address.zip_code,
          type: "products",
        };

    try {
      setLoading(true);
      const response = await shippingRate(payload);
      // Save email to sessionStorage ONLY if different
      const existingEmail = sessionStorage.getItem("checkout_email");
      if (!existingEmail || existingEmail !== email) {
        sessionStorage.setItem("checkout_email", email);
      }
      if (response?.rate) {
        setShippingRates(response.rate);
      }
    } catch (err) {
      let message = "An error occurred while saving the item";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>;
        message = axiosErr.response?.data?.message ?? axiosErr.message;
      }
      toast.error(message);
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Check if the cart has items */}
        {cart && cart.length > 0 ? (
          <>
            <div className="flex-1">
              <h2 className="card text-xl font-semibold text-gray-800 mb-8">
                {isServiceOrder
                  ? "Service Booking Information"
                  : "Shipping Information"}
              </h2>
              <form
                className="grid grid-cols-1 bg-white p-6 rounded-lg shadow-md md:grid-cols-2 gap-4 text-gray-500!"
                onSubmit={handleSubmit}
              >
                {/* Customer Info using TextInput */}
                {!user?.name && (
                  <TextInput
                    placeholder="First name"
                    label="First Name" // Added a label for better accessibility
                    value={firstname}
                    onChange={(e) => setFirstname(e)}
                    required
                  />
                )}

                {!user?.last_name && (
                  <TextInput
                    placeholder="Last name"
                    label="Last Name" // Added a label
                    value={lastname}
                    onChange={(e) => setLastname(e)}
                    required
                  />
                )}

                {!user?.email && (
                  <TextInput
                    placeholder="Email address"
                    label="Email Address" // Added a label
                    value={email}
                    onChange={(e) => setEmail(e)}
                    required
                  />
                )}

                {/* 👇 Conditional Fields */}
                {!isServiceOrder ? (
                  <>
                    {/* Only render AddressAutocomplete after script loaded */}
                    <div className="md:col-span-2">
                      {googleLoaded && (
                        <GoogleAddressAutocomplete
                          onSelect={(addr) =>
                            setAddress((prev) => ({ ...prev, ...addr }))
                          }
                        />
                      )}
                    </div>
                    <TextInput
                      placeholder="Street address"
                      label="Street Address"
                      value={address.street_address}
                      onChange={(e) => handleAddressChange("street_address", e)}
                      required
                      // disabled={!!address.street_address}
                    />
                    <TextInput
                      placeholder="City"
                      label="City"
                      value={address.city}
                      onChange={(e) => handleAddressChange("city", e)}
                      required
                      disabled={!!address.city}
                    />
                    <TextInput
                      placeholder="Province"
                      label="Province"
                      value={address.state}
                      onChange={(e) => handleAddressChange("state", e)}
                      required
                      disabled={!!address.state}
                    />
                    <TextInput
                      placeholder="Postal code"
                      label="Postal Code"
                      value={address.zip_code}
                      onChange={(e) => handleAddressChange("zip_code", e)}
                      required
                      disabled={!!address.zip_code}
                    />
                    <TextInput
                      placeholder="Country"
                      label="Country"
                      value={address.country}
                      onChange={(e) => handleAddressChange("country", e)}
                      required
                      disabled={!!address.country}
                    />
                    {/* Phone input wrapper with label to match other grid items */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="flex items-stretch h-12"> 
                        <div className="flex items-center justify-center px-3 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 text-gray-700 text-sm min-w-20">
                          <span className="mr-2">
                            {countryCodeToFlag(address.country)}
                          </span>
                          <span className="font-medium">
                            {address.dialCode || "+1"}
                          </span>
                        </div>
                        {/* Phone input */}
                        <input
                          type="tel"
                          className="input rounded-l-none! flex-1"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="712 345 678"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label
                        htmlFor="serviceNote"
                        className="text-sm font-medium text-gray-700 block mb"
                      >
                        Service Notes
                      </label>
                      <textarea
                        id="serviceNote"
                        placeholder="Describe your service needs or special instructions..."
                        value={serviceNote}
                        onChange={(e) => setServiceNote(e.target.value)}
                        rows={4}
                        className="input w-full!"
                        required
                        maxLength={250}
                      />
                    </div>
                    {/* 
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label htmlFor="preferredDate" className="text-sm font-medium text-gray-700 block">
                        Preferred Date & Time
                      </label>
                      <input
                        id="preferredDate"
                        type="datetime-local"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="input w-full!"
                        required
                      />
                    </div> */}
                    <AppointmentPicker />
                  </>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !!shippingFee} // disable if shippingFee exists
                  className={`mt-2 w-full py-3 rounded-full font-medium md:col-span-2 transition ${
                    loading || !!shippingFee
                      ? "btn btn-gray"
                      : "btn btn-primary"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : isServiceOrder
                    ? "Book Service"
                    : "Get Shipping Rate"}
                </button>
              </form>
            </div>

            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shippingRates={shippingRates}
              onSelectRate={(fee) => setShippingFee(fee)}
              shippingFee={shippingFee}
            />
          </>
        ) : (
          // SHOW this message if cart is empty (from previous fix)
          <div className="w-full text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              No items to checkout
            </h2>
            <p className="mt-2 text-gray-500">
              Please add items to your cart to proceed with checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
