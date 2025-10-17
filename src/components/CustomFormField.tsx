"use client";

import React, { useState, FocusEvent } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { FormFieldType } from "@/constants/formFieldType";

import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";

interface CustomProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  isEditable?: boolean;
  widthClass?: string;
  maxLength?: number;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disable?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  rows?: number;
  className?: string;
}

/**
 * Input Field Component
 */
const TextInput = ({
  field,
  isEditable,
  placeholder,
  maxLength,
  onFocus,
  onBlur,
  widthClass,
  iconSrc,
  iconAlt,
  className,
}: Partial<CustomProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
}) => (
  <div className={`flex rounded-xl ${widthClass || "w-full"}`}>
    {iconSrc && (
      <Image
        src={iconSrc}
        height={24}
        width={24}
        alt={iconAlt || "icon"}
        className="ml-2"
      />
    )}
    <FormControl>
      <Input
        placeholder={placeholder}
        {...field}
        value={field.value || ""}
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={!isEditable}
        className={clsx(
          `${className} shad-input p-2 md:p-4 placeholder:text-base`,
          {
            "bg-[#FFFFFF] cursor-not-allowed": !isEditable,
          }
        )}
      />
    </FormControl>
  </div>
);

/**
 * Password Field Component
 */
const PasswordInput = ({
  field,
  isEditable,
  placeholder,
  widthClass,
}: Partial<CustomProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative flex rounded-xl ${widthClass || "w-full"}`}>
      <FormControl>
        <Input
          {...field}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          readOnly={!isEditable}
          className="shad-input p-2 md:p-4 placeholder:text-base"
        />
      </FormControl>
      {isEditable && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? (
            <Eye className="h-5 w-5 text-gray-600" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-600" />
          )}
        </button>
      )}
    </div>
  );
};

/**
 * RenderField Component - Handles different field types
 */
const RenderField = ({
  field,
  props,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return <TextInput field={field} {...props} />;
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl
          className={`flex items-center rounded-md border ${
            props.widthClass || "w-full"
          }`}
        >
          <PhoneInput
            defaultCountry="NG"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value}
            onChange={field.onChange}
            className="placeholder:text-base p-2 md:p-4  md:rounded-xl"
            maxLength={17}
          />
        </FormControl>
      );
    case FormFieldType.PASSWORD:
      return <PasswordInput field={field} {...props} />;
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center my-1 gap-1">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            {props.label && (
              <Label
                className="text-xs font-normal leading-4 text-[#5C5F6A]"
                htmlFor={props.name}
              >
                {props.label}
              </Label>
            )}
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex gap-1 rounded-md bg-white h-[44px] py-[10px] px-3">
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={props.showTimeSelect ?? false}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {props.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <div className="flex flex-col">
            {props.iconSrc && (
              <Image
                src={props.iconSrc}
                height={24}
                width={24}
                alt={props.iconAlt || "icon"}
                className="mb-2"
              />
            )}
            <textarea
              {...field}
              placeholder={props.placeholder}
              className="border p-5 md:rounded-lg focus:outline-none w-full"
              rows={props.rows || 3}
              readOnly={!props.isEditable}
            />
          </div>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return (
        <div className="flex rounded-md border animate-pulse bg-gray-200 h-[44px] w-full"></div>
      );
    default:
      return null;
  }
};

/**
 * CustomFormField Component - Wrapper for form fields
 */
const CustomFormField = (props: CustomProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && props.label && (
            <FormLabel className="text-xs md:text-sm font-normal">
              {props.label}
            </FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
