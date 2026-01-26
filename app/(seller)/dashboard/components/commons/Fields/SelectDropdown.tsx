"use client";

import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

type Option = {
  label: string;
  value: string;
  description?: string; // New field
  children?: Option[];
};

type SelectDropdownProps = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string; // Added optional label for the field itself
};

export default function SelectDropdown({
  options,
  value,
  onChange,
  className = "w-full",
  disabled = false,
  placeholder = "Select an item",
  label,
}: SelectDropdownProps) {
  const displayLabel = value.value === "" ? placeholder : value.label;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}
        >
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={`relative w-full cursor-default rounded-lg border py-3 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-hub-secondary focus:border-hub-secondary text-sm transition duration-150 ${className} ${
              disabled
                ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                : value.value === ""
                  ? "text-gray-500 border-gray-300 bg-white"
                  : "text-gray-900 border-gray-300 bg-white"
            }`}
          >
            <span className="block truncate">{displayLabel}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl bg-white border border-gray-200 py-1 text-sm shadow-lg focus:outline-none">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                      active
                        ? "bg-green-50 text-hub-secondary"
                        : "text-gray-700"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex flex-col">
                        <span
                          className={`block truncate ${selected ? "font-bold" : "font-normal"}`}
                        >
                          {option.label}
                        </span>
                        {/* THE DESCRIPTION LOGIC */}
                        {option.description && (
                          <span
                            className={`text-xs mt-0.5 ${selected ? "text-hub-secondary/80" : "text-gray-500"}`}
                          >
                            {option.description}
                          </span>
                        )}
                      </div>

                      {selected && (
                        <span className="absolute inset-y-0 left-2 flex items-center text-hub-secondary">
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
