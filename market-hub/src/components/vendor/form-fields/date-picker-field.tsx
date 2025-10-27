"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/vendor/ui/button";
import { Calendar } from "@/components/vendor/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/vendor/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/vendor/ui/popover";

interface DatePickerFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Pick a date",
  disabled = false,
  className,
  required = false,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}