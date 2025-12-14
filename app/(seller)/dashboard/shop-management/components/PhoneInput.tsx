// components/PhoneInput.tsx
"use client";

import React from "react";
import { BeatLoader } from "react-spinners";

interface Props {
  countryFlag?: string;
  dialCode?: string;
  value: string;
  onChange: (v: string) => void;
  validating?: boolean;
  valid?: boolean | null;
}

export default function PhoneInput({
  countryFlag,
  dialCode,
  value,
  onChange,
  validating,
  valid,
}: Props) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block text-gray-700">
        Shop phone number
      </label>
      <div className="flex items-center">
        <div className="flex items-center justify-center h-[49px] px-3 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 text-gray-700! text-sm min-w-[100px]">
          <span className="mr-2">{countryFlag}</span>
          <span>{dialCode}</span>
        </div>
        <input
          type="tel"
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="712 345 678"
        />
        <div className="ml-3 w-8">
          {validating ? (
            <BeatLoader size={6} />
          ) : valid === true ? (
            <span className="text-green-600 text-lg">✓</span>
          ) : valid === false ? (
            <span className="text-red-600 text-lg">✕</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
