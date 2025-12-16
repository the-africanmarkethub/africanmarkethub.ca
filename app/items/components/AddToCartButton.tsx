// AddToCartButton.tsx
"use client";

import {
  CalendarIcon,
  CheckIcon,
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
  const [added, setAdded] = useState(false);

  const isInCart = useMemo(
    () => cart?.some((item) => item.id === product.id),
    [cart, product.id]
  );

  const isService = product.type !== "products";

  const handleAddToCart = () => {
    if (cart.length > 0) {
      const firstItemType = cart[0].type;
      const isFirstItemService = firstItemType !== "products";

      if (isService !== isFirstItemService) {
        toast.error(
          `Cart already contains ${
            isFirstItemService ? "services" : "products"
          }. Clear it to switch types.`,
          {
            duration: 9000,
            icon: "⚠️",
          }
        );
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
      toast.success("Item added to cart!");
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    } else {
      router.push("/carts");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={stockQty <= 0 && !isService}
      className={`btn rounded-full! text-xs! transition-all duration-300 flex items-center gap-2 px-6 py-2 font-bold ${
        added
          ? "bg-hub-secondary text-white scale-105 shadow-inner"
          : isInCart
          ? "bg-hub-secondary text-white hover:opacity-90 shadow-md"
          : stockQty > 0 || isService
          ? "bg-hub-primary text-white hover:bg-hub-secondary shadow-md active:scale-95"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {added ? (
        <>
          <CheckIcon className="h-4 w-4 text-white animate-pulse" />
          {isService ? "Booked!" : "Added!"}
        </>
      ) : isInCart ? (
        <>
          <ShoppingCartIcon className="h-4 w-4" />
          View Cart
        </>
      ) : stockQty > 0 || isService ? (
        <>
          {isService ? (
            <CalendarIcon className="h-4 w-4" />
          ) : (
            <ShoppingCartIcon className="h-4 w-4" />
          )}
          {isService ? "Book Now" : "Add to Cart"}
        </>
      ) : (
        "Out of Stock"
      )}
    </button>
  );
}
