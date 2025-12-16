// QuantityControl.tsx
"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface QuantityControlProps {
  quantity: number;
  stockQty: number;
  increase: () => void;
  decrease: () => void;
}

export default function QuantityControl({
  quantity,
  stockQty,
  increase,
  decrease,
}: QuantityControlProps) {
  const isOutOfStock = stockQty <= 0;

  return (
    <div className="flex items-center rounded-md">
      <button
        onClick={decrease}
        disabled={quantity <= 1 || isOutOfStock}
        className="btn btn-gray rounded-full! disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusIcon className="h-3 w-3" />
      </button>
      <span className="px-4 text-gray-500 font-semibold">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= stockQty || isOutOfStock}
        className="btn btn-gray rounded-full! disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="h-3 w-3" />
      </button>
    </div>
  );
}
