// components/PhoneInput.tsx
"use client";

import React from "react";
import { BeatLoader } from "react-spinners";

interface Props {
  countryFlag?: string;
  dialCode?: string;
  value: string;
  onChange: (v: string) => void; 
}

export default function PhoneInput({
  countryFlag,
  dialCode,
  value,
  onChange, 
}: Props) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block text-gray-700">
        Phone number <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center">
        <div className="flex items-center justify-center h-12.25 px-3 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700! text-sm min-w-25">
          <span className="mr-2">{countryFlag}</span>
          <span>{dialCode}</span>
        </div>
        <input
          type="tel"
          className="rounded-r-xl px-3 h-12.25 border border-gray-300 focus:border-hub-primary focus:ring-1 focus:ring-hub-primary outline-none w-full text-gray-900 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="712 345 678"
          maxLength={10}
          required
        /> 
      </div>
    </div>
  );
}
