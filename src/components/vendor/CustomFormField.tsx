"use client";

import React, { useState, FocusEvent } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { CloudUpload, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/vendor/RichTextEditor"),
  { ssr: false }
);

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/vendor/ui/form";
import { Input } from "@/components/vendor/ui/input";
import { Checkbox } from "@/components/vendor/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Label } from "@/components/vendor/ui/label";
import { FormFieldType } from "@/constants/vendor/formFieldType";

import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";

interface CustomProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fieldType: FormFieldType;
  name: Path<TFieldValues>;
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
  acceptedFileTypes?: string;
  onFileChange?: (file: File | null) => void;
}

interface FieldProps {
  field: {
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<unknown>;
  };
  isEditable?: boolean;
  placeholder?: string;
  maxLength?: number;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  widthClass?: string;
  iconSrc?: string;
  iconAlt?: string;
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
}: FieldProps) => (
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
        ref={field.ref as React.LegacyRef<HTMLInputElement>}
        value={
          typeof field.value === "string" || typeof field.value === "number"
            ? field.value
            : ""
        }
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={!isEditable}
        className={clsx(
          `${className} shad-input bg-[#FFFFFF] p-2 placeholder:text-base md:p-4`,
          {
            "cursor-not-allowed bg-[#FFFFFF]": !isEditable,
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
}: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`relative flex rounded-xl ${widthClass || "w-full"}`}>
      <FormControl>
        <Input
          {...field}
          ref={field.ref as React.LegacyRef<HTMLInputElement>}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={
            typeof field.value === "string" || typeof field.value === "number"
              ? field.value
              : ""
          }
          readOnly={!isEditable}
          className="shad-input bg-[#FFFFFF] p-2 placeholder:text-base md:p-4"
        />
      </FormControl>
      {isEditable && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-2 -translate-y-1/2 transform"
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
 * Simple File Upload Component
 */
const FileUploadInput = ({
  field,
  isEditable = true,
  acceptedFileTypes = "image/*",
  placeholder = "Choose files or drag and drop",
  onFileChange,
}: FieldProps & { acceptedFileTypes?: string; onFileChange?: (file: File | null) => void }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    field.onChange(file);
    
    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Create new preview URL
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      setPreviewUrl(null);
    }
    
    // Call the external onFileChange callback if provided
    if (onFileChange) {
      onFileChange(file);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <FormControl>
      <div className="flex flex-col w-full">
        <div className="flex flex-col items-center justify-center w-full border border-[#EEEEEE] rounded-md bg-[#F8F8F8] p-4 min-h-[120px]">
          {previewUrl ? (
            // Show preview image
            <div className="flex flex-col items-center w-full">
              <Image
                src={previewUrl}
                width={80}
                height={80}
                alt="Preview"
                className="max-w-20 max-h-20 object-contain rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600 text-center">
                {(field.value as File)?.name || "Selected file"}
              </p>
            </div>
          ) : (
            // Show upload placeholder
            <>
              <Image
                src="/assets/icons/Image.svg"
                width={24}
                height={24}
                alt="Upload"
                className="mb-[5px]"
              />
              <div className="flex items-center text-[#BDBDBD] mb-2 gap-3 justify-center">
                <CloudUpload width={24} height={24} />
                <p className="text-base leading-[22px] font-medium text-center">
                  {placeholder}
                </p>
              </div>
              <p className="text-[#BDBDBD] font-normal text-sm">Image (1MB)</p>
            </>
          )}
          <Input
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            disabled={!isEditable}
            className="absolute w-full opacity-0 cursor-pointer"
          />
        </div>
        {typeof field.value === "object" &&
          field.value !== null &&
          "name" in field.value && (
            <p className="text-xs text-gray-500 mt-1">
              Selected file: {String((field.value as { name?: string }).name)}
            </p>
          )}
      </div>
    </FormControl>
  );
};

/**
 * RenderField Component - Handles different field types
 */
const RenderField = <TFieldValues extends FieldValues>({
  field,
  props,
}: {
  field: FieldProps["field"];
  props: CustomProps<TFieldValues>;
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
            defaultCountry="CA"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            className="bg-[#FFFFFF] p-2 placeholder:text-base md:rounded-xl md:p-4"
            maxLength={17}
          />
        </FormControl>
      );
    case FormFieldType.PASSWORD:
      return <PasswordInput field={field} {...props} />;
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="my-1 flex items-center gap-1">
            <Checkbox
              id={props.name}
              checked={typeof field.value === "boolean" ? field.value : false}
              onCheckedChange={field.onChange}
            />
            {props.label && (
              <Label
                className="text-xs leading-4 font-normal text-[#5C5F6A]"
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
        <div className="flex h-[54px] w-full gap-1 border rounded-[8px] bg-white px-3 py-[10px]">
          <FormControl>
            <DatePicker
              selected={
                field.value instanceof Date
                  ? field.value
                  : field.value
                  ? new Date(field.value as string)
                  : null
              }
              onChange={field.onChange}
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={props.showTimeSelect ?? false}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.DATE_TIME_PICKER:
      return (
        <div className="flex h-[54px] w-full gap-1 border rounded-[8px] bg-white px-3 py-[10px]">
          <FormControl>
            <DatePicker
              selected={
                field.value instanceof Date
                  ? field.value
                  : field.value
                  ? new Date(field.value as string)
                  : null
              }
              onChange={(date: Date | null) => {
                field.onChange(
                  date ? date.toISOString().slice(0, 19).replace("T", " ") : ""
                );
              }}
              dateFormat={props.dateFormat ?? "yyyy-MM-dd HH:mm:ss"}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl className={props.widthClass || " rounded-[8px] w-full"}>
          <Select
            value={typeof field.value === "string" ? field.value : ""}
            onValueChange={field.onChange}
            disabled={props.disable}
          >
            <SelectTrigger className="w-full rounded-[8px] bg-[#FFFFFF] border-[#EEEEEE] h-[54px]">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#FFFFFF]">
              {props.options && props.options.length > 0 ? (
                props.options.map(
                  (option: { label: string; value: string }) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                )
              ) : (
                <div className="px-8 py-4 text-center text-muted-foreground text-sm">
                  No data available
                </div>
              )}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <div className="flex flex-col">
            <textarea
              {...field}
              ref={field.ref as React.LegacyRef<HTMLTextAreaElement>}
              placeholder={props.placeholder}
              className="w-full border border-[#EEEEEE] rounded-[8px] p-5 focus:outline-none md:rounded-lg"
              rows={props.rows || 3}
              readOnly={!props.isEditable}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </div>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return (
        <div className="flex h-[44px] w-full animate-pulse rounded-md border bg-gray-200"></div>
      );
    case FormFieldType.FILE_UPLOAD:
    case FormFieldType.FILE:
      return <FileUploadInput field={field} {...props} onFileChange={props.onFileChange} />;
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            type="number"
            placeholder={props.placeholder}
            {...field}
            ref={field.ref as React.LegacyRef<HTMLInputElement>}
            value={
              typeof field.value === "string" || typeof field.value === "number"
                ? field.value
                : ""
            }
            readOnly={!props.isEditable}
            className={clsx(
              `${props.className} shad-input bg-[#FFFFFF] p-2 placeholder:text-base md:p-4`,
              {
                "cursor-not-allowed bg-[#FFFFFF]": !props.isEditable,
              }
            )}
          />
        </FormControl>
      );
    case FormFieldType.RICH_TEXT:
      return (
        <div className="w-full">
          <RichTextEditor
            value={typeof field.value === "string" ? field.value : ""}
            onChange={field.onChange}
            className="bg-white"
            placeholder={props.placeholder}
          />
        </div>
      );
    default:
      return null;
  }
};

/**
 * CustomFormField Component - Wrapper for form fields
 */
const CustomFormField = <TFieldValues extends FieldValues>(
  props: CustomProps<TFieldValues>
) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && props.label && (
            <FormLabel className="text-sm font-normal">{props.label}</FormLabel>
          )}
          <RenderField<TFieldValues> field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
