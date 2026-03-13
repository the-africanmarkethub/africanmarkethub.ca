"use client";
import SelectDropdown from "@/app/(seller)/dashboard/components/commons/Fields/SelectDropdown";
import { getAddress } from "@/lib/api/auth/shipping";
import { PRICING_MODEL_OPTIONS, DELIVERY_METHOD_OPTIONS } from "@/setting";
import { timeOptions } from "@/utils/generateTimeSlot";
import { useEffect, useState } from "react";

export default function ServiceFields(props: any) {
  const {
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

  useEffect(() => {
    if (estimatedDeliveryTime && !deliveryHours && !deliveryMinutes) {
      const hourMatch = estimatedDeliveryTime.match(/(\d+)\s*hour/i);
      const minuteMatch = estimatedDeliveryTime.match(/(\d+)\s*minute/i);

      if (hourMatch) setDeliveryHours(hourMatch[1]);
      if (minuteMatch) setDeliveryMinutes(minuteMatch[1]);
    }
  }, [estimatedDeliveryTime]);

  useEffect(() => {
    if (!deliveryHours && !deliveryMinutes) return;

    const parts = [];
    if (deliveryHours && parseInt(deliveryHours) > 0) {
      parts.push(`${deliveryHours} ${parseInt(deliveryHours) === 1 ? "hour" : "hours"}`);
    }
    if (deliveryMinutes && parseInt(deliveryMinutes) > 0) {
      parts.push(`${deliveryMinutes} ${parseInt(deliveryMinutes) === 1 ? "minute" : "minutes"}`);
    }

    const combined = parts.join(" ");

    if (combined !== estimatedDeliveryTime) {
      setEstimatedDeliveryTime(combined);
    }
  }, [deliveryHours, deliveryMinutes, estimatedDeliveryTime, setEstimatedDeliveryTime]);
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
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

      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estimated Delivery Time
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deliveryHours}
                onChange={(e) => setDeliveryHours(e.target.value)}
                className="w-full input"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">Hrs</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deliveryMinutes}
                onChange={(e) => setDeliveryMinutes(e.target.value)}
                className="w-full input"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">Mins</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected
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

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Available From
          </label>
          <SelectDropdown
            options={timeOptions}
            value={
              timeOptions.find((opt) => opt.value === availableFrom?.substring(0, 5)) || {
                label: "",
                value: "",
              }
            }
            onChange={(selected) => setAvailableFrom(selected.value)}
            placeholder="Select Start Time"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Available To
          </label>
          <SelectDropdown
            options={timeOptions.filter(
              (opt) => !availableFrom || opt.value > availableFrom,
            )}
            value={
              timeOptions.find((opt) => opt.value === availableTo?.substring(0, 5)) || {
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
