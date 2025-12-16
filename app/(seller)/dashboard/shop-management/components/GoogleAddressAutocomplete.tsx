"use client";

import { useEffect, useRef } from "react";
import GoogleAddress from "@/interfaces/googleAddress";
import { ALLOWED_COUNTRIES } from "@/setting";
import { getDialCode } from "@/lib/api/ip/countries";

type Address = {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  lat?: number;
  lng?: number;
  dialCode?: string;
};

type Props = {
  onSelect: (addr: Address) => void;
  placeholder?: string;
  countryRestrictions?: string[];
};

export default function GoogleAddressAutocomplete({
  onSelect,
  placeholder = "Start typing address (autocomplete)...",
  countryRestrictions = ALLOWED_COUNTRIES.map((c) => c.toLowerCase()),
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const google = (window as any).google;

    if (typeof window !== "undefined" && google && inputRef.current) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: countryRestrictions },
          fields: ["address_components", "geometry", "formatted_address"],
        }
      );

      autoCompleteRef.current?.addListener("place_changed", async () => {
        const place = autoCompleteRef.current?.getPlace();
        if (!place || !place.address_components) return;

        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();

        const components: Record<string, string> = {};

        place.address_components.forEach((comp: GoogleAddress) => {
          const types = comp.types;
          if (types.includes("street_number"))
            components.street = comp.long_name;
          if (types.includes("route"))
            components.street = `${components.street ?? ""} ${
              comp.long_name
            }`.trim();
          if (types.includes("locality") || types.includes("postal_town"))
            components.city = comp.long_name;
          if (types.includes("administrative_area_level_1"))
            components.state = comp.short_name ?? comp.long_name;
          if (types.includes("postal_code")) components.zip = comp.long_name;
          if (types.includes("country"))
            components.country = comp.short_name ?? comp.long_name;
        });

        const dialCode = components.country
          ? await getDialCode(components.country)
          : "";

        onSelect({
          street_address: components.street ?? place.formatted_address ?? "",
          city: components.city ?? "",
          state: components.state ?? "",
          zip_code: components.zip ?? "",
          country: components.country ?? "",
          lat,
          lng,
          dialCode,
        });
      });
    }
  }, [countryRestrictions, onSelect]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        className="input w-full"
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
