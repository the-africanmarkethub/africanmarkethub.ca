"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Address from "@/interfaces/address";
import { shippingRate } from "@/lib/api/customer/shippingRate";
import toast from "react-hot-toast";
import { ShippingRateResponse } from "@/interfaces/shippingRate";
import { useAuthStore } from "@/store/useAuthStore";
import TextInput from "../(seller)/dashboard/shop-management/components/TextInput";
import GoogleAddressAutocomplete from "../(seller)/dashboard/shop-management/components/GoogleAddressAutocomplete";
import { countryCodeToFlag } from "@/utils/countryFlag";
import Coupon from "@/interfaces/coupon";
import verifyCoupon from "@/lib/api/customer/coupon";
import Modal from "../components/common/Modal";
import OrderSummary from "./components/OrderSummary";
import { getAddress } from "@/lib/api/auth/shipping";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] =
    useState<ShippingRateResponse | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>();
  const [error, setError] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const [address, setAddress] = useState<Address>({
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    dialCode: "",
    country: "",
  });

  const [firstname, setFirstname] = useState(user?.name || "");
  const [lastname, setLastname] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [showPersonalDetails, setShowPersonalDetails] = useState(true);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // === Coupon Logic ===
  const handleApplyCoupon = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyCoupon(couponCode);

      // Match your API structure: status === "success" and top-level is_active
      if (res?.status === "success" && res?.is_active && res.discount) {
        const { discount_rate, discount_type } = res.discount;

        // Convert "10.9" string to Number
        const rate = Number(discount_rate);

        const calculatedDiscount =
          discount_type === "fixed" ? rate : (subtotal * rate) / 100;

        setDiscount(calculatedDiscount);
        setAppliedCoupon(res.discount); // Set the discount object
        toast.success("Coupon applied!");
        setShowCouponModal(false);
      } else {
        const msg = res?.message || "Invalid or inactive coupon";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      setError("Failed to apply coupon.");
      toast.error("Failed to apply coupon.");
    } finally {
      setLoading(false);
    }
  };
  // === Submission & Validation ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!firstname.trim()) return toast.error("First name is required");
    if (!lastname.trim()) return toast.error("Last name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!phone.trim()) return toast.error("Phone number is required");

    // 2. Address Validation
    if (!address.street_address.trim())
      return toast.error("Street address is required");
    if (!address.city.trim()) return toast.error("City is required");

    // State 2-letter validation
    const stateTrimmed = address.state.trim();

    if (stateTrimmed.length !== 2) {
      return toast.error("State must be a 2-letter code (e.g., NY or ON)");
    }

    if (address.zip_code.length < 6) {
      return toast.error(
        "Incomplete/Incorrect postal code.",
      );
    }

    if (!address.country.trim()) return toast.error("Country is required");

    const payload = {
      firstname,
      lastname,
      email,
      phone,
      country: address.country,
      street: address.street_address,
      city: address.city,
      state: address.state,
      zip: address.zip_code,
      type: "products",
      products: cart.map((item) => ({
        id: item.id,
        variation_id: item.variation_id || null,
        quantity: item.qty,
        price: item.price,
        color: item.color || null,
        size: item.size || null,
      })),
    };

    try {
      setLoading(true);
      const response = await shippingRate(payload);

      sessionStorage.setItem("checkout_email", email);

      if (response?.rate) {
        setShippingRates(response.rate);
        toast.success("Shipping rates updated");
      }
    } catch (err) {
      let message = "An error occurred while calculating shipping";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSavedAddress = async () => {
      // Only attempt if we have a user in the store,
      // but don't block guests if we don't.
      if (!user) return;

      try {
        const addrRes = await getAddress();
        if (addrRes && addrRes.street_address) {
          setAddress({
            street_address: addrRes.street_address || "",
            city: addrRes.city || "",
            state: addrRes.state || "",
            zip_code: addrRes.zip_code || "",
            country: addrRes.country || "",
            phone: addrRes.phone || "",
            dialCode: addrRes.dialCode || "+1",
          });

          if (addrRes.phone) setPhone(addrRes.phone);

          // Collapse the personal details if we successfully auto-filled
          setShowPersonalDetails(false);
        }
      } catch (error) {
        // Guest path: API might return 401, we just ignore it.
        console.log("Proceeding as Guest.");
      }
    };

    fetchSavedAddress();
  }, [user]);

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
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="flex flex-col gap-8 px-4 mx-auto lg:px-8 lg:flex-row max-w-7xl">
        {cart && cart.length > 0 ? (
          <>
            <div className="flex-1">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Shipping Information
              </h2>
              <form
                className="grid grid-cols-1 gap-4 p-6 bg-white rounded-lg shadow-sm md:grid-cols-2"
                onSubmit={handleSubmit}
              >
                <div className="pb-4 mb-2 border-b border-gray-100 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowPersonalDetails(!showPersonalDetails)}
                    className="flex items-center justify-between w-full text-left cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                        Personal Details
                      </span>
                      {!showPersonalDetails && (
                        <span className="mt-1 text-xs text-gray-400">
                          {firstname} {lastname} • {email}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-hub-primary">
                      <span className="text-xs font-medium group-hover:underline">
                        {showPersonalDetails ? "Hide" : "Edit Details"}
                      </span>
                      {showPersonalDetails ? (
                        <FaChevronUp className="text-xs" />
                      ) : (
                        <FaChevronDown className="text-xs" />
                      )}
                    </div>
                  </button>
                </div>
                {showPersonalDetails && (
                  <>
                    <TextInput
                      label="First Name"
                      value={firstname}
                      onChange={setFirstname}
                      required
                    />
                    <TextInput
                      label="Last Name"
                      value={lastname}
                      onChange={setLastname}
                      required
                    />
                    <div className="md:col-span-2">
                      <TextInput
                        label="Email Address"
                        value={email}
                        onChange={setEmail}
                        required
                        placeholder="for tracking purposes"
                      />
                    </div>
                  </>
                )}
                {/* Identity Fields */}

                <div className="pt-2 md:col-span-2">
                  <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Delivery Address
                  </span>
                </div>

                {/* Address Section */}
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
                  label="Street Address"
                  value={address.street_address}
                  onChange={(v) => handleAddressChange("street_address", v)}
                  required
                />
                <TextInput
                  label="City"
                  value={address.city}
                  onChange={(v) => handleAddressChange("city", v)}
                  required
                />
                <TextInput
                  label="Province"
                  value={address.state}
                  onChange={(v) => handleAddressChange("state", v)}
                  required
                />
                <TextInput
                  label="Postal Code"
                  value={address.zip_code}
                  onChange={(v) => handleAddressChange("zip_code", v)}
                  required
                />
                <span hidden>
                  <TextInput
                    label="Country"
                    value={address.country}
                    onChange={(v) => handleAddressChange("country", v)}
                    required
                  />
                </span>

                {/* Phone Section */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex items-stretch h-12">
                    <div className="flex items-center justify-center px-3 text-sm text-gray-700 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 min-w-20">
                      <span className="mr-2">
                        {countryCodeToFlag(address.country)}
                      </span>
                      <span className="font-medium">
                        {address.dialCode || "+1"}
                      </span>
                    </div>
                    <input
                      type="tel"
                      className="flex-1 px-3 border border-gray-300 rounded-l-none outline-none input focus:ring-1 focus:ring-hub-primary"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="712 345 678"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !!shippingFee}
                  className={`mt-4 w-full py-3 rounded-full font-medium md:col-span-2 transition ${
                    loading || !!shippingFee
                      ? "btn btn-gray cursor-not-allowed"
                      : "btn btn-primary text-white hover:bg-opacity-90"
                  }`}
                >
                  {loading ? "Calculating..." : "Get Shipping Rate"}
                </button>
              </form>
            </div>

            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shippingRates={shippingRates}
              onSelectRate={setShippingFee}
              discount={discount}
              appliedCoupon={appliedCoupon}
              shippingFee={shippingFee}
              setShowCouponModal={setShowCouponModal}
            />

            <Modal
              isOpen={showCouponModal}
              onClose={() => setShowCouponModal(false)}
              title="Apply Coupon"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded input"
                  placeholder="Enter coupon code"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCouponModal(false)}
                    className="w-full btn btn-gray"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loading || !couponCode}
                    className="w-full text-white btn btn-primary "
                  >
                    {loading ? "Checking..." : "Apply"}
                  </button>
                </div>
              </div>
            </Modal>
          </>
        ) : (
          <div className="w-full py-20 text-center bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Add products to your cart to proceed with checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
