// AddToCartButton.tsx
"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
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

  const handleAddToCart = () => {
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
      disabled={stockQty <= 0}
      className={`btn btn-primary rounded-full! text-xs! ${
        added
          ? "bg-red-800 text-white scale-105"
          : isInCart
          ? "bg-red-800 text-white hover:bg-red-700"
          : stockQty > 0
          ? "bg-red-400 text-white hover:bg-red-800"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {added ? (
        <>
          <CheckIcon className="h-5 w-5 text-white animate-bounce" /> Added!
        </>
      ) : isInCart ? (
        "View Cart"
      ) : stockQty > 0 ? (
        "Add to Cart"
      ) : (
        "Out of Stock"
      )}
    </button>
  );
}
