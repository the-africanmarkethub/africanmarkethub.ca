"use client";
import { handleDecimalChange, handleIntegerChange } from "@/utils/inputMode";

export default function PriceFields(props: any) {
  const {
    selectedCategory,
    salesPrice,
    setSalesPrice,
    regularPrice,
    setRegularPrice,
    quantity,
    setQuantity,
    shopType,
  } = props;

  // Logic Check: Is the selected category Transportation & Logistics (ID 33)?
  const isTransLogistics = selectedCategory?.value === "33";

  // Determine grid columns:
  // If logistics, we hide prices, so we only need 1 col for quantity.
  // Otherwise, use 3 cols for products or 2 for services.
  const gridCols = isTransLogistics
    ? "grid-cols-1"
    : shopType === "products"
      ? "grid-cols-3"
      : "grid-cols-2";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {!isTransLogistics && (
        <>
          {/* Sales Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sales Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={salesPrice}
              onChange={(e) =>
                handleDecimalChange(e.target.value, setSalesPrice)
              }
              className="input w-full"
              placeholder="0.00"
            />
          </div>

          {/* Regular Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={regularPrice}
              onChange={(e) =>
                handleDecimalChange(e.target.value, setRegularPrice)
              }
              className="input w-full"
              placeholder="0.00"
            />
          </div>
        </>
      )}

      {/* Quantity - Visible if it's a product shop OR if it's Logistics */}
      {/* (Assuming Logistics still needs a quantity/capacity field) */}
      {(shopType === "products") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isTransLogistics ? "Available Capacity / Quantity" : "Quantity"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => handleIntegerChange(e.target.value, setQuantity)}
            className="input w-full"
            placeholder="0"
          /> 
        </div>
      )}
    </div>
  );
}
