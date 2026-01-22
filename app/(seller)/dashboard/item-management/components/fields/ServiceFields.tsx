"use client";
import SelectDropdown from "@/app/(seller)/dashboard/components/commons/Fields/SelectDropdown";
import { getAddress } from "@/lib/api/auth/shipping";
import { PRICING_MODEL_OPTIONS, DELIVERY_METHOD_OPTIONS } from "@/setting";
import { timeOptions } from "@/utils/generateTimeSlot";
import { useEffect, useState } from "react";
import Link from "next/link"; // Assuming you use Next.js Link

export default function ServiceFields(props: any) {
  const {
    selectedCategory,
    pricingModel,
    setPricingModel,
    deliveryMethod,
    setDeliveryMethod,
    estimatedDeliveryTime,
    setEstimatedDeliveryTime,
    availableDays,
    setAvailableDays,
    availableFrom,
    setAvailableFrom,
    availableTo,
    setAvailableTo,
    dayOptions,
    setDeliveryArea,
  } = props;

  const [deliveryHours, setDeliveryHours] = useState("");
  const [deliveryMinutes, setDeliveryMinutes] = useState("");
  const [storeCity, setStoreCity] = useState("Loading...");

  const isTransLogistics = selectedCategory?.value === "33";

  // Fetch address once on mount
  useEffect(() => {
    const fetchStoreAddress = async () => {
      try {
        const response = await getAddress();
        if (response && response.city) {
          setStoreCity(response.city);
        } else {
          setStoreCity("Not Set");
        }
      } catch (error) {
        console.error("Failed to fetch address", error);
        setStoreCity("Error loading city");
      }
    };
    fetchStoreAddress();
  }, []);

  // Update delivery time string
  useEffect(() => {
    const parts = [];
    if (deliveryHours && parseInt(deliveryHours) > 0) {
      parts.push(
        `${deliveryHours} ${parseInt(deliveryHours) === 1 ? "hour" : "hours"}`,
      );
    }
    if (deliveryMinutes && parseInt(deliveryMinutes) > 0) {
      parts.push(
        `${deliveryMinutes} ${parseInt(deliveryMinutes) === 1 ? "minute" : "minutes"}`,
      );
    }
    const combined = parts.join(" ");
    setEstimatedDeliveryTime(combined);
  }, [deliveryHours, deliveryMinutes, setEstimatedDeliveryTime]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* SHIPPING FEE INFO */}
        {isTransLogistics && (
          <div className="col-span-2 bg-hub-primary/10 p-4 rounded-md mb-2 border border-hub-primary/20">
            <label className="block text-sm font-bold text-hub-secondary mb-1">
              Shipping Fee (Tiered Pricing)
            </label>
            <p className="text-xs text-hub-secondary/80">
              Fixed pricing based on item value on checkout.
            </p>
          </div>
        )}

        {/* PRICING & DELIVERY (Hidden for Logistics) */}
        {!isTransLogistics && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pricing Model
              </label>
              <SelectDropdown
                options={PRICING_MODEL_OPTIONS}
                value={pricingModel}
                onChange={(v: any) => setPricingModel(v)}
                placeholder="Select Pricing Model"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Method
              </label>
              <SelectDropdown
                options={DELIVERY_METHOD_OPTIONS}
                value={deliveryMethod}
                onChange={(v: any) => setDeliveryMethod(v)}
                placeholder="Select Delivery Method"
              />
            </div>
          </>
        )}

        {/* DELIVERY AREA (Informative Box) */}
        {isTransLogistics && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Zone
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={storeCity}
                className="input w-full bg-gray-50 text-gray-500 cursor-not-allowed border-dashed"
              />
              <p className="mt-1.5 text-[11px] text-gray-500 flex justify-between">
                <span>The primary city or region for your deliveries.</span>
                <Link
                  href="/dashboard/storefront"
                  className="text-hub-secondary hover:underline font-medium"
                >
                  Change in Storefront →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {/* Estimated Delivery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Delivery Time
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deliveryHours}
                onChange={(e) => setDeliveryHours(e.target.value)}
                className="input w-full"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">Hrs</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deliveryMinutes}
                onChange={(e) => setDeliveryMinutes(e.target.value)}
                className="input w-full"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">Mins</span>
            </div>
          </div>
        </div>

        {/* Available Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Days
          </label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day: string) => {
              const isSelected = availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setAvailableDays(
                        availableDays.filter((d: any) => d !== day),
                      );
                    } else {
                      setAvailableDays([...availableDays, day]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    isSelected
                      ? "bg-hub-secondary border-hub-secondary text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="capitalize">{day}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available From
          </label>
          <SelectDropdown
            options={timeOptions}
            value={
              timeOptions.find((opt) => opt.value === availableFrom) || {
                label: "",
                value: "",
              }
            }
            onChange={(selected) => setAvailableFrom(selected.value)}
            placeholder="Select Start Time"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available To
          </label>
          <SelectDropdown
            options={timeOptions.filter(
              (opt) => !availableFrom || opt.value > availableFrom,
            )}
            value={
              timeOptions.find((opt) => opt.value === availableTo) || {
                label: "",
                value: "",
              }
            }
            onChange={(selected) => setAvailableTo(selected.value)}
            placeholder="Select End Time"
          />
        </div>
      </div>
    </>
  );
}
