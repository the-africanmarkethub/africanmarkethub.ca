import React from "react";
import { useSizes } from "@/hooks/customer/useSizes";
import { Size } from "@/types/customer/product.types";
import { Badge } from "./badge";
import { Loader2 } from "lucide-react";

interface SizeSelectorProps {
  selectedSize?: number;
  onSizeSelect?: (size: Size) => void;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
  variant?: "default" | "compact" | "grid" | "text-pills";
  sizes?: Size[]; // Optional prop for passing sizes directly
  disabledSizes?: number[]; // Optional prop to disable specific size IDs
}

export default function SizeSelector({
  selectedSize,
  onSizeSelect,
  className = "",
  showLabel = true,
  disabled = false,
  variant = "default",
  sizes: passedSizes,
  disabledSizes = [],
}: SizeSelectorProps) {
  const {
    data: fetchedSizesData,
    isLoading,
    error,
  } = useSizes({
    // Only fetch if sizes are not passed as a prop
    enabled: !passedSizes,
  });

  const sizes = passedSizes || fetchedSizesData?.data || [];

  if (isLoading && !passedSizes) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading sizes...</span>
      </div>
    );
  }

  if (error && !passedSizes) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Failed to load sizes
      </div>
    );
  }

  if (sizes.length === 0) {
    return null; // Don't render if no sizes
  }

  const handleSizeClick = (size: Size) => {
    if (!disabled && !disabledSizes.includes(size.id) && onSizeSelect) {
      onSizeSelect(size);
    }
  };

  const isSizeDisabled = (sizeId: number) => {
    return disabled || disabledSizes.includes(sizeId);
  };

  if (variant === "text-pills") {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size:{" "}
            <span className="font-bold">
              {sizes.find((s) => s.id === selectedSize)?.name || "Not Selected"}
            </span>
          </label>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              disabled={isSizeDisabled(size.id)}
              className={`transition-all text-base font-medium
              ${
                selectedSize === size.id
                  ? "bg-primary w-6 h-6 text-xs text-[#000000] rounded-full"
                  : "text-gray-700 hover:text-primary"
              } ${
                isSizeDisabled(size.id) ? "opacity-30 cursor-not-allowed" : ""
              }`}
              onClick={() => handleSizeClick(size)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 mr-2">Size:</span>
        )}
        {sizes.map((size) => (
          <Badge
            key={size.id}
            variant={selectedSize === size.id ? "default" : "secondary"}
            className={`transition-colors ${
              isSizeDisabled(size.id)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-primary/80"
            }`}
            onClick={() => handleSizeClick(size)}
          >
            {size.name}
          </Badge>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Size
          </label>
        )}
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              disabled={isSizeDisabled(size.id)}
              className={`p-3 border rounded-lg text-center transition-all ${
                selectedSize === size.id
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 hover:border-primary hover:bg-primary/5"
              } ${
                isSizeDisabled(size.id)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => handleSizeClick(size)}
            >
              <span className="text-sm font-medium">{size.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Size
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            type="button"
            disabled={isSizeDisabled(size.id)}
            className={`px-4 py-2 border rounded-lg transition-all ${
              selectedSize === size.id
                ? "border-primary bg-primary text-white"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            } ${
              isSizeDisabled(size.id)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => handleSizeClick(size)}
          >
            <span className="text-sm font-medium">{size.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
