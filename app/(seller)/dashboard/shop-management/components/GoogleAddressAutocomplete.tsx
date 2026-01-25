"use client";

import { useEffect, useRef, useState } from "react";
import { ALLOWED_COUNTRIES } from "@/setting";
import { getDialCode } from "@/lib/api/ip/countries";
import toast from "react-hot-toast";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";

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
  initialValue?: string; // Helpful for editing existing addresses
};

export default function GoogleAddressAutocomplete({
  onSelect,
  placeholder = "Search for your address...",
  countryRestrictions = ALLOWED_COUNTRIES.map((c) => c.toLowerCase()),
  initialValue = "",
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isValidated, setIsValidated] = useState(false); // New: validation state
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);

  const placesLib = useRef<google.maps.PlacesLibrary | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;
      try {
        const lib = (await google.maps.importLibrary(
          "places",
        )) as google.maps.PlacesLibrary;
        placesLib.current = lib;
        setSessionToken(new lib.AutocompleteSessionToken());
      } catch (error) {
        console.error("Failed to load Google Places library:", error);
      }
    };
    init();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setIsValidated(false); // Reset validation if they start typing again

    if (val.length > 2 && placesLib.current && sessionToken) {
      const { AutocompleteSuggestion } = placesLib.current;
      const request: any = {
        input: val,
        includedRegionCodes: countryRestrictions,
        sessionToken: sessionToken,
      };

      try {
        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        setSuggestions(response.suggestions || []);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (
    suggestion: google.maps.places.AutocompleteSuggestion,
  ) => {
    const predictionText = suggestion.placePrediction?.text?.text;
    if (!predictionText) return;

    setValue(predictionText);
    setSuggestions([]);

    if (!placesLib.current) return;

    const place = suggestion.placePrediction?.toPlace();
    if (!place) return;

    await place.fetchFields({
      fields: ["addressComponents", "location", "formattedAddress"],
    });

    const lat = place.location?.lat();
    const lng = place.location?.lng();
    const components: Record<string, string> = {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };

    place.addressComponents?.forEach((comp) => {
      const types = comp.types;
      if (types.includes("street_number"))
        components.street = comp.longText ?? "";
      if (types.includes("route"))
        components.street =
          `${components.street} ${comp.longText ?? ""}`.trim();
      if (types.includes("locality")) components.city = comp.longText ?? "";
      if (types.includes("administrative_area_level_1"))
        components.state = comp.shortText ?? comp.longText ?? "";
      if (types.includes("postal_code")) {
        const code = comp.longText ?? "";
        components.zip = code;
        if (code.replace(/\s/g, "").length < 3) {
          // Adjusted for global zip variations
          toast.error("Please ensure the postal code is complete.");
        }
      }
      if (types.includes("country"))
        components.country = comp.shortText ?? comp.longText ?? "";
    });

    const dialCode = components.country
      ? await getDialCode(components.country)
      : "";

    onSelect({
      street_address: components.street || place.formattedAddress || "",
      city: components.city || "",
      state: components.state || "",
      zip_code: components.zip || "",
      country: components.country || "",
      lat,
      lng,
      dialCode,
    });

    setIsValidated(true); // Successful validation!
    setSessionToken(new placesLib.current.AutocompleteSessionToken());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full group">
      <div className="flex items-center gap-1.5 mb-1.5 text-slate-500">
        <FaMapMarkerAlt className="text-[10px]" />
        <span className="text-xs font-medium">
          Start typing and select your address from the list.
        </span>
      </div>

      <div className="relative">
        <input
          className={`input w-full pr-10 transition-all duration-200 ${
            isValidated
              ? "border-green-500 focus:ring-green-200"
              : "border-slate-200"
          }`}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />

        {/* Validation Checkmark */}
        {isValidated && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-300">
            <FaCheckCircle size={18} />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-100 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-64 overflow-y-auto shadow-xl py-1">
          {suggestions.map((s, idx) => {
            const text = s.placePrediction?.text?.text;
            if (!text) return null;

            return (
              <li
                key={s.placePrediction?.placeId || idx}
                className={`px-4 py-2.5 cursor-pointer text-sm transition-colors border-b last:border-0 border-slate-50 ${
                  activeIndex === idx
                    ? "bg-green-50 text-green-700 font-medium"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
                onClick={() => handleSelect(s)}
              >
                {text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
