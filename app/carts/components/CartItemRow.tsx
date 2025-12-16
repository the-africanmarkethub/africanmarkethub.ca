"use client";

import Image from "next/image";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CartItem } from "@/context/CartContext";
import { getStockStatus } from "@/utils/ItemUtils";
import { formatAmount } from "@/utils/formatCurrency";
import WishlistButton from "@/app/(customer)/account/wishlists/components/WishlistButton";

type Props = {
  item: CartItem;
  updateQty: (id: number, qty: number) => void;
  openRemoveModal: (item: CartItem) => void;
};

export default function CartItemRow({
  item,
  updateQty,
  openRemoveModal,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Image
          src={item.image}
          alt={item.title}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        <div>
          <h3
            title={item.title}
            className="text-xs sm:text-lg font-medium text-gray-800 line-clamp-2"
          >
            {item.title}
          </h3>
          <span
            className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
              getStockStatus(item.stockQty ?? 0).bgClass
            }`}
          >
            {getStockStatus(item.stockQty ?? 0).text}
          </span>

          <div className="flex items-center gap-2 mt-2 text-orange-800">
            <button
              aria-label="quantity reduce"
              onClick={() => updateQty(item.id, item.qty - 1)}
              disabled={item.qty <= 1}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100 text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon className="w-3 h-3" />
            </button>

            <span className="text-sm font-medium">{item.qty}</span>

            <button
              aria-label="quantity increase"
              onClick={() => {
                if (item.stockQty !== undefined && item.qty >= item.stockQty)
                  return;
                updateQty(item.id, item.qty + 1);
              }}
              disabled={
                item.stockQty !== undefined && item.qty >= item.stockQty
              }
              className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-100 text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-full">
        <span className="text-xs sm:text-lg font-semibold text-gray-800">
          {formatAmount(Number(item.price) * Number(item.qty))}
        </span>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => openRemoveModal(item)}
            title="Remove"
            className="p-2 sm:px-3 sm:py-1.5 hover:text-red-800 flex items-center gap-1 bg-red-50 text-red-700 rounded-full text-sm font-medium transition cursor-pointer"
          >
            <TrashIcon className="h-5 w-5 text-red-700 hover:text-red-500" />
            <span className="hidden sm:inline">Remove</span>
          </button>
          <WishlistButton product={item} />
        </div>
      </div>
    </div>
  );
}
