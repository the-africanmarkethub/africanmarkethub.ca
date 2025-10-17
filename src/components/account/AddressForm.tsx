"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateAddressPayload, Address } from "@/services/addressService";
import { Country, State, City } from "country-state-city";

interface AddressFormProps {
  onSubmit: (data: CreateAddressPayload) => void;
  onCancel: () => void;
  initialData?: Address;
  isLoading?: boolean;
}

const addressLabels = ["Home", "Office", "Other"];

export default function AddressForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AddressFormProps) {
  const [countries] = useState(() => Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    // trigger,
    reset,
  } = useForm<CreateAddressPayload>({
    mode: "onBlur",
    defaultValues: initialData
      ? {
          street_address: initialData.street_address || "",
          city: initialData.city || "",
          state: initialData.state || "",
          zip_code: initialData.zip_code || "",
          country: initialData.country || "",
          phone: initialData.phone || "",
          address_label: initialData.address_label || "Home",
        }
      : {
          street_address: "",
          city: "",
          state: "",
          zip_code: "",
          country: "Canada",
          phone: "",
          address_label: "Home",
        },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Track if form is initialized to prevent resetting on country change during edit
  const [isInitialized, setIsInitialized] = useState(false);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find((c) => c.name === selectedCountry);
      if (country) {
        setSelectedCountryCode(country.isoCode);
        const countryStates = State.getStatesOfCountry(country.isoCode);
        setStates(countryStates);

        // Only reset state and city when country changes after initialization
        // Don't reset during initial load when editing
        if (isInitialized) {
          setValue("state", "");
          setValue("city", "");
          setCities([]);
        }
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, countries, setValue, isInitialized]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountryCode) {
      const state = states.find((s) => s.name === selectedState);
      if (state) {
        setSelectedStateCode(state.isoCode);
        const stateCities = City.getCitiesOfState(
          selectedCountryCode,
          state.isoCode
        );
        setCities(stateCities);
        // Only reset city when state changes if we're not initializing
        if (isInitialized) {
          setValue("city", "");
        }
      }
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountryCode, states, setValue, isInitialized]);

  // Reset form and initialize dropdowns when editing existing address
  useEffect(() => {
    if (initialData) {
      // Reset the form with the new data
      reset({
        street_address: initialData.street_address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zip_code: initialData.zip_code || "",
        country: initialData.country || "",
        phone: initialData.phone || "",
        address_label: initialData.address_label || "Home",
      });

      // Initialize country dropdown
      if (initialData.country) {
        const country = countries.find((c) => c.name === initialData.country);
        if (country) {
          setSelectedCountryCode(country.isoCode);
          const countryStates = State.getStatesOfCountry(country.isoCode);
          setStates(countryStates);

          // Initialize state dropdown
          if (initialData.state) {
            const state = countryStates.find(
              (s: any) => s.name === initialData.state
            );
            if (state) {
              setSelectedStateCode(state.isoCode);
              const stateCities = City.getCitiesOfState(
                country.isoCode,
                state.isoCode
              );
              setCities(stateCities);

              // If there are no cities in the dropdown, the city field will be a text input
              // and it already has the value from the reset() call above
            }
          }
        }
      }
      // Mark as initialized after setting up the form
      // setTimeout(() => setIsInitialized(true), 100);
    }
  }, [initialData, countries, reset]);

  // Initialize Canada states by default for new addresses
  useEffect(() => {
    if (!initialData && selectedCountry === "Canada") {
      const canada = countries.find((c) => c.name === "Canada");
      if (canada) {
        setSelectedCountryCode(canada.isoCode);
        const canadaStates = State.getStatesOfCountry(canada.isoCode);
        setStates(canadaStates);
      }
    }
  }, [selectedCountry, countries, initialData]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="space-y-6"
    >
      {/* Hidden inputs for select field validation */}
      <input
        {...register("country", { required: "Country is required" })}
        type="hidden"
      />
      <input
        {...register("state", { required: "State is required" })}
        type="hidden"
      />
      <input
        {...register("city", { required: "City is required" })}
        type="hidden"
      />
      <input
        {...register("address_label", {
          required: "Address label is required",
        })}
        type="hidden"
      />
      <div>
        <Label htmlFor="address_label" className="text-gray-900 font-medium">
          Address Label
        </Label>
        <Select
          value={watch("address_label")}
          onValueChange={(value) =>
            setValue("address_label", value, { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500">
            <SelectValue placeholder="Select label" />
          </SelectTrigger>
          <SelectContent>
            {addressLabels.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.address_label && (
          <p className="text-sm text-red-500 mt-1">
            {errors.address_label.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="street_address" className="text-gray-900 font-medium">
          Street Address
        </Label>
        <div>
          <Input
            {...register("street_address", {
              required: "Street address is required",
            })}
            placeholder="Your Street Address"
            className="h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500"
          />
          {errors.street_address && (
            <p className="text-sm text-red-500 mt-1">
              {errors.street_address.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="country" className="text-gray-900 font-medium">
            Country/Region
          </Label>
          <Select
            value={watch("country")}
            onValueChange={(value) =>
              setValue("country", value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-[274.67px] h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.name}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">
              {errors.country.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-gray-900 font-medium">
            Province/State
          </Label>
          <Select
            value={watch("state")}
            onValueChange={(value) =>
              setValue("state", value, { shouldValidate: true })
            }
            disabled={!selectedCountry || states.length === 0}
          >
            <SelectTrigger className="w-[274.67px] h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="city" className="text-gray-900 font-medium">
            Town/City
          </Label>
          {cities.length > 0 ? (
            <Select
              value={watch("city")}
              onValueChange={(value) =>
                setValue("city", value, { shouldValidate: true })
              }
              disabled={!selectedState}
            >
              <SelectTrigger className="w-full h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500">
                <SelectValue placeholder="Town/City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              {...register("city", { required: "City is required" })}
              placeholder="Town/City"
              disabled={!selectedState}
              className="w-full h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500"
            />
          )}
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <Label htmlFor="zip_code" className="text-gray-900 font-medium">
            Zip Code
          </Label>
          <Input
            {...register("zip_code", {
              required: "Postal/ZIP code is required",
            })}
            placeholder="Zip Code"
            className="w-[274.67px] h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500"
          />
          {errors.zip_code && (
            <p className="text-sm text-red-500 mt-1">
              {errors.zip_code.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <Label htmlFor="phone" className="text-gray-900 font-medium">
            Phone Number
          </Label>
          <Input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Please enter a valid phone number",
              },
            })}
            placeholder="Your Phone Number"
            className="w-full h-[54px] px-4 py-3 gap-2 rounded-lg border text-gray-500"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#F28C0D] hover:bg-[#E67C00]"
        >
          {isLoading
            ? "Saving..."
            : initialData
              ? "Update Address"
              : "Add Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
