"use client";

import { useCart } from "@/contexts/customer/CartContext";
import { CartItem as CartItemType } from "@/types/customer/cart.types";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import WishlistButton from "@/components/customer/WishlistButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: CartItemType;
  isLastItem: boolean;
  isSelected: boolean;
  onSelectionChange: (id: number, checked: boolean) => void;
}

export default function CartItem({
  item,
  isLastItem,
  isSelected,
  onSelectionChange,
}: CartItemProps) {
  const { updateCartItemQuantity, deleteCartItem: removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id);
      toast.info("Item removed from cart");
      return;
    }
    updateCartItemQuantity(item.id, newQuantity);
  };

  // Early return if product data is not available (should not happen with new implementation)
  if (!item.product) {
    console.warn("Cart item missing product data:", item);
    return null;
  }

  const productVariation = useMemo(() => {
    if (item.product?.variations && item.color_id && item.size_id) {
      return item.product.variations.find(
        (v) => v.color_id === item.color_id && v.size_id === item.size_id
      );
    }
    return null;
  }, [item]);

  const price = productVariation?.price || item.product?.sales_price || 0;
  const stock = productVariation?.quantity || item.product?.quantity || 0;
  const isInStock = stock > 0;

  return (
    <div
      className={`p-2 md:p-4 ${!isLastItem ? "border-b border-gray-200" : ""}`}
    >
      {/* Mobile Layout */}
      <div className="flex md:hidden gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelectionChange(item.id, Boolean(checked))
          }
          className="mt-1"
          aria-label={`Select ${item.product?.title || 'Product'}`}
        />
        <div className="relative w-[85px] h-[113px] rounded-[8px] overflow-hidden flex-shrink-0 bg-gray-50">
          <Image
            src={item.product?.images?.[0] || "/assets/default.png"}
            alt={item.product?.title || 'Product'}
            fill
            className="object-cover"
            sizes="85px"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-normal text-sm text-gray-800 leading-tight mb-1">
            {item.product?.title}
          </h3>

          <p className="font-semibold text-sm mb-2">
            {parseFloat(price.toString()).toFixed(2)} CAD
          </p>

          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={isInStock ? "outline" : "destructive"}
              className={`text-[10px] font-medium ${
                isInStock
                  ? "bg-green-100 text-green-700 border-transparent"
                  : "bg-red-100 text-red-700 border-transparent"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </Badge>
            {item.color && (
              <span className="text-xs text-gray-500">
                Color: {item.color.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-1.5 text-gray-500 hover:text-black"
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span className="px-2 font-medium text-xs">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= stock}
                className="p-1.5 text-gray-500 hover:text-black disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <WishlistButton
                productId={item.product_id}
                variant="outline"
                size="sm"
                className="!w-7 !h-7"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-500 hover:text-red-500"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-start gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelectionChange(item.id, Boolean(checked))
          }
          className="mt-1"
          aria-label={`Select ${item.product?.title || 'Product'}`}
        />
        <div className="relative w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.product?.images?.[0] || "/assets/default.png"}
            alt={item.product?.title || 'Product'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-normal text-base text-gray-800 leading-tight mb-2">
            {item.product?.title}
          </h3>

          <Badge
            variant={isInStock ? "outline" : "destructive"}
            className={`text-xs font-medium ${
              isInStock
                ? "bg-green-100 text-green-700 border-transparent"
                : "bg-red-100 text-red-700 border-transparent"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>

          <div className="text-sm text-gray-500 mt-2">
            {item.color && <span>Color: {item.color.name}</span>}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="p-2 text-gray-500 hover:text-black"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 font-medium text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= stock}
                className="p-2 text-gray-500 hover:text-black disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between self-stretch">
          <p className="font-semibold text-lg">
            {parseFloat(price.toString()).toFixed(2)} CAD
          </p>
          <div className="flex items-center gap-2">
            <WishlistButton
              productId={item.product_id}
              variant="outline"
              size="md"
              className="!w-10 !h-10"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Remove item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
