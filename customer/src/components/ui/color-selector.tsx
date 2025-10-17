import React from "react";
import { useColors } from "@/hooks/useColors";
import { Color } from "@/types/product.types";
import { Badge } from "./badge";
import { Loader2 } from "lucide-react";

interface ColorSelectorProps {
  selectedColor?: number;
  onColorSelect?: (color: Color) => void;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
  variant?: "default" | "compact" | "grid" | "swatches";
  colors?: Color[]; // Optional prop for passing colors directly
  disabledColors?: number[]; // Optional prop to disable specific color IDs
}

export default function ColorSelector({
  selectedColor,
  onColorSelect,
  className = "",
  showLabel = true,
  disabled = false,
  variant = "default",
  colors: passedColors,
  disabledColors = [],
}: ColorSelectorProps) {
  const {
    data: fetchedColorsData,
    isLoading,
    error,
  } = useColors({
    // Only fetch if colors are not passed as a prop
    enabled: !passedColors,
  });

  const colors = passedColors || fetchedColorsData?.data || [];

  if (isLoading && !passedColors) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading colors...</span>
      </div>
    );
  }

  if (error && !passedColors) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Failed to load colors
      </div>
    );
  }

  if (colors.length === 0) {
    return null; // Don't render anything if there are no colors
  }

  const handleColorClick = (color: Color) => {
    if (!disabled && !disabledColors.includes(color.id) && onColorSelect) {
      onColorSelect(color);
    }
  };

  const isColorDisabled = (colorId: number) => {
    return disabled || disabledColors.includes(colorId);
  };

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 mr-2">Color:</span>
        )}
        {colors.map((color) => (
          <Badge
            key={color.id}
            variant={selectedColor === color.id ? "default" : "secondary"}
            className={`cursor-pointer transition-colors ${
              isColorDisabled(color.id)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/80"
            }`}
            onClick={() => handleColorClick(color)}
          >
            {color.name}
          </Badge>
        ))}
      </div>
    );
  }

  if (variant === "swatches") {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colour:{" "}
            <span className="font-bold">
              {colors.find((c) => c.id === selectedColor)?.name ||
                "Not Selected"}
            </span>
          </label>
        )}
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              disabled={isColorDisabled(color.id)}
              className={`relative w-4 h-4 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              ${
                selectedColor === color.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-gray-400"
              } ${
                isColorDisabled(color.id)
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{
                backgroundColor: color.hexcode || "#ccc",
              }}
              onClick={() => handleColorClick(color)}
              title={color.name}
            >
              {selectedColor === color.id && (
                <div className="absolute inset-0 rounded-full border-2 border-white"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Color
          </label>
        )}
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              disabled={isColorDisabled(color.id)}
              className={`p-3 border rounded-lg text-center transition-all ${
                selectedColor === color.id
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 hover:border-primary hover:bg-primary/5"
              } ${
                isColorDisabled(color.id)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => handleColorClick(color)}
            >
              <div className="flex items-center gap-2">
                {color.hexcode && (
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: color.hexcode }}
                  ></div>
                )}
                <span className="text-sm font-medium">{color.name}</span>
              </div>
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
          Select Color
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            disabled={isColorDisabled(color.id)}
            className={`px-4 py-2 border rounded-lg transition-all flex items-center gap-2 ${
              selectedColor === color.id
                ? "border-primary bg-primary text-white"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            } ${isColorDisabled(color.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => handleColorClick(color)}
          >
            {color.hexcode && (
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: color.hexcode }}
              ></div>
            )}
            <span className="text-sm font-medium">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
