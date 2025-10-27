"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/vendor/ui/form";
import { Textarea } from "@/components/vendor/ui/textarea";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  rows?: number;
}

export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  required = false,
  rows = 4,
}: TextareaFieldProps<TFieldValues>) {
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
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "resize-none transition-colors focus:border-primary",
                field.value ? "border-primary" : ""
              )}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
