"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/vendor/ui/form";
import { Input } from "@/components/vendor/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface FileUploadFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  preview?: boolean;
}

export function FileUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  accept = "image/*",
  multiple = false,
  disabled = false,
  className,
  required = false,
  preview = true,
}: FileUploadFieldProps<TFieldValues>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="space-y-4">
              <Input
                {...field}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  const file = files[0];
                  onChange(multiple ? files : file);

                  // Generate preview for images
                  if (preview && file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={cn(
                  "cursor-pointer file:cursor-pointer",
                  "file:mr-4 file:py-2 file:px-4",
                  "file:rounded-md file:border-0",
                  "file:text-sm file:font-semibold",
                  "file:bg-primary file:text-primary-foreground",
                  "hover:file:bg-primary/90"
                )}
              />
              {preview && previewUrl && (
                <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}