"use client";

import {
  CheckIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: any;
  selectedImage: string;
  quantity: number;
  stockQty: number;
}

export default function AddToCartButton({
  product,
  selectedImage,
  quantity,
  stockQty,
}: AddToCartButtonProps) {
  const { cart, addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isService = product.type === "services";

  const isInCart = useMemo(
    () => cart?.some((item) => item.id === product.id),
    [cart, product.id]
  );

  const handleAction = async () => {
    if (isService) {
      setLoading(true);
      toast("Starting chat to engage service provider...", {
        icon: "💬",
        className: "text-sm font-medium",
      });

      setTimeout(() => {
        router.push(`/account/chat?item=${product.id}`);
        setLoading(false);
      }, 800);
      return;
    }

    if (cart.length > 0) {
      const isFirstItemService = cart[0].type === "services";

      if (isFirstItemService) {
        toast.error("Book the service, you can not add service to cart", {
          duration: 4000,
          icon: "⚠️",
        });
        return;
      }
    }

    if (stockQty <= 0) return;

    if (!isInCart) {
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        type: product.type,
        stockQty,
        price: parseFloat(product.sales_price),
        image: selectedImage,
        qty: quantity,
        stock: stockQty > 0,
      });
      toast.success("Added to cart!");
    } else {
      router.push("/carts");
    }
  };

  // Button Visual Config
  const getButtonStyles = () => {
    if (isService)
      return "bg-red-800 text-white hover:bg-red-900 shadow-lg active:scale-95";
    if (stockQty <= 0) return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (isInCart)
      return "bg-hub-secondary text-white hover:opacity-90 shadow-md";
    return "bg-hub-primary text-white hover:bg-hub-secondary shadow-md active:scale-95";
  };

  return (
    <button
      onClick={handleAction}
      disabled={(stockQty <= 0 && !isService) || loading}
      className={`relative overflow-hidden min-w-40 rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 px-6 py-1.5 font-bold cursor-pointer ${getButtonStyles()}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Connecting...
        </span>
      ) : isService ? (
        <>
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          Book & Chat
        </>
      ) : isInCart ? (
        <>
          <CheckIcon className="h-5 w-5" />
          View in Cart
        </>
      ) : stockQty > 0 ? (
        <>
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Cart
        </>
      ) : (
        "Out of Stock"
      )}
    </button>
  );
}
