"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/vendor/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  disabled = false,
  className,
  required = false,
}: SelectFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}