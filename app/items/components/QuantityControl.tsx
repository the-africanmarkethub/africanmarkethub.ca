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
    <div className="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm w-fit">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= 1 || isOutOfStock}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-active active:scale-90"
      >
        <MinusIcon className="w-3.5 h-3.5 stroke-[3px]" />
      </button>

      <span className="text-sm font-bold text-orange-900 min-w-5 text-center">
        {isOutOfStock ? 0 : quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= stockQty || isOutOfStock}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-active active:scale-90"
      >
        <PlusIcon className="w-3.5 h-3.5 stroke-[3px]" />
      </button>
    </div>
  );
}
