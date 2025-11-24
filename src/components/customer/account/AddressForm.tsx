"use client";
import { useState, useEffect } from "react";
import { useForm, Control, FieldValues } from "react-hook-form";
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
import CustomFormField from "@/components/customer/CustomFormField";
import { FormFieldType } from "@/constants/customer/formFieldType";
import { Form } from "@/components/ui/form";

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

  const form = useForm<CreateAddressPayload>({
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
          country: "CA",
          phone: "",
          address_label: "Home",
        },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    control,
  } = form;

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Track if form is initialized to prevent resetting on country change during edit
  const [isInitialized, setIsInitialized] = useState(false);

  // Load states when country changes - since we only support Canada, always load Canadian states
  useEffect(() => {
    const canada = countries.find((c) => c.isoCode === "CA");
    if (canada) {
      setSelectedCountryCode(canada.isoCode);
      const countryStates = State.getStatesOfCountry(canada.isoCode);
      setStates(countryStates);

      // Only reset state and city when country changes after initialization
      // Don't reset during initial load when editing
      if (isInitialized && selectedCountry !== "CA") {
        setValue("state", "");
        setValue("city", "");
        setCities([]);
      }
    }
  }, [countries, setValue, isInitialized, selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountryCode) {
      // selectedState is now already the state code (isoCode)
      const state = states.find((s) => s.isoCode === selectedState);
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
      // Initialize country dropdown - handle both code and name formats
      let countryCode = initialData.country;
      if (initialData.country && initialData.country.length > 2) {
        // If it's a full country name, find its code
        const country = countries.find((c) => c.name === initialData.country);
        countryCode = country ? country.isoCode : "CA";
      } else if (!countryCode) {
        countryCode = "CA";
      }
      
      // Initialize state - handle both code and name formats
      let stateCode = initialData.state;
      if (countryCode) {
        const countryStates = State.getStatesOfCountry(countryCode);
        setStates(countryStates);
        
        if (initialData.state && initialData.state.length > 2) {
          // If it's a full state name, find its code
          const state = countryStates.find((s: any) => s.name === initialData.state);
          stateCode = state ? state.isoCode : "";
        }
        
        if (stateCode) {
          setSelectedStateCode(stateCode);
          const stateCities = City.getCitiesOfState(countryCode, stateCode);
          setCities(stateCities);
        }
      }
      
      // Reset the form with the converted data
      reset({
        street_address: initialData.street_address || "",
        city: initialData.city || "",
        state: stateCode || "",
        zip_code: initialData.zip_code || "",
        country: countryCode || "CA",
        phone: initialData.phone || "",
        address_label: initialData.address_label || "Home",
      });

      setSelectedCountryCode(countryCode);
      // Mark as initialized after setting up the form
      // setTimeout(() => setIsInitialized(true), 100);
    }
  }, [initialData, countries, reset]);

  // Initialize Canada states by default since we only support Canada
  useEffect(() => {
    const canada = countries.find((c) => c.isoCode === "CA");
    if (canada) {
      setSelectedCountryCode(canada.isoCode);
      const canadaStates = State.getStatesOfCountry(canada.isoCode);
      setStates(canadaStates);
      // Ensure the country is always set to CA (Canada code)
      setValue("country", "CA", { shouldValidate: true });
    }
  }, [countries, setValue]);

  return (
    <Form {...form}>
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
          <SelectTrigger className="w-full h-[54px]">
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
            className="h-[54px]"
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
            value="CA"
            onValueChange={() => {}} // No-op since it's always Canada
            disabled
          >
            <SelectTrigger className="w-full h-[54px]">
              <SelectValue placeholder="Canada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">
                <span className="flex items-center gap-2">
                  <span>🇨🇦</span>
                  <span>Canada</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
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
            <SelectTrigger className="w-full h-[54px]">
              <SelectValue placeholder="State">
                {watch("state") && states.find(s => s.isoCode === watch("state"))?.name || watch("state")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
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
              <SelectTrigger className="w-full h-[54px] ">
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
              className="w-full h-[54px] "
            />
          )}
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode" className="text-gray-900 font-medium">
            Zip Code
          </Label>
          <Input
            {...register("zip_code", {
              required: "Postal/ZIP code is required",
            })}
            placeholder="Zip Code"
            className="w-full h-[54px]"
          />
          {errors.zip_code && (
            <p className="text-sm text-red-500 mt-1">
              {errors.zip_code.message}
            </p>
          )}
        </div>

        <div>
          <CustomFormField
            isEditable
            fieldType={FormFieldType.PHONE_INPUT}
            control={control as unknown as Control<FieldValues>}
            name="phone"
            label="Phone Number"
            placeholder="+1 604 555 5555"
            widthClass="w-full"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#F28C0D] hover:bg-[#E67C00] text-white"
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
    </Form>
  );
}
