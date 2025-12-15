"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import ItemTabs, { StarRating } from "./ItemTabs";
import { useCart } from "@/context/CartContext";
import { formatAmount } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import WishlistButton from "@/app/(customer)/account/wishlists/components/WishlistButton";
import parse from "html-react-parser";
import Item from "@/interfaces/items";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ItemDetailProps {
  product: Item;
  reviews: any[];
  star_rating: StarRating;
  recommended: Item[];
  frequentlyBoughtTogether: Item[];
  otherViews: Item[];
  customerAlsoViewed: Item[];
}

export default function ItemDetail({
  product,
  reviews,
  star_rating,
  recommended,
  frequentlyBoughtTogether,
  otherViews,
  customerAlsoViewed,
}: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || "/placeholder.png"
  );
  const [added, setAdded] = useState(false);

  const { addToCart, cart } = useCart();
  const router = useRouter();

  const isInCart = useMemo(
    () => cart?.some((item) => item.id === product.id),
    [cart, product.id]
  );

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const salesPrice = parseFloat(product.sales_price);
  const regularPrice = parseFloat(product.regular_price);

  const discount =
    regularPrice > salesPrice
      ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        type: product.type,
        price: salesPrice,
        image: selectedImage,
        qty: quantity,
        stock: true,
      });

      toast.success("Item added to cart!");
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    } else {
      router.push("/carts");
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT IMAGE SECTION */}
          <div className="flex gap-4 lg:col-span-1">
            {/* SMALLER THUMBNAILS */}
            <div className="flex flex-col gap-3">
              {product.images?.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${product.title} ${i}`}
                  width={30}
                  height={30}
                  className={`rounded-md cursor-pointer border ${
                    selectedImage === img ? "border-red-800" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            {/* BIGGER MAIN IMAGE */}
            <div className="flex-1">
              <Zoom>
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="rounded-lg shadow-md w-full object-cover max-h-137.5 cursor-zoom-in"
                />
              </Zoom>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-semibold">{product.title}</h1>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatAmount(salesPrice)}
              </span>

              {regularPrice > salesPrice && (
                <>
                  <span className="line-through text-gray-400">
                    {formatAmount(regularPrice)}
                  </span>
                  <span className="text-red-800 font-semibold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="text-gray-500 line-clamp-2">
              {parse(product.description)}
            </div>

            {/* QUANTITY + ADD TO CART */}
            <div className="flex items-center gap-2 mt-5">
              <div className="flex items-center rounded-md">
                <button
                  onClick={decreaseQty}
                  className="btn btn-gray rounded-full!"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="px-4 text-gray-500 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="btn btn-gray rounded-full!"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn btn-primary rounded-full! text-xs! ${
                  added
                    ? "bg-red-800 text-white scale-105"
                    : isInCart
                    ? "bg-red-800 text-white hover:bg-red-700"
                    : "bg-red-400 text-white hover:bg-red-800"
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon className="h-5 w-5 text-white animate-bounce" />
                    Added!
                  </>
                ) : isInCart ? (
                  "View Cart"
                ) : (
                  "Add to Cart"
                )}
              </button>

              {/* @ts-ignore */}
              <WishlistButton product={product} />
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>
                Category:{" "}
                <Link
                  href={`/items?category=${product.category?.slug}&type=${product.type}`}
                  className="text-red-800"
                >
                  {product.category?.name}
                </Link>
              </p>

              <p>{product?.sku}</p>

              <p>
                Seller:{" "}
                <Link className="" href={`/shops/${product?.shop?.slug}`}>
                  <span className="text-red-800 text-xs truncate">
                    Similar items from {product?.shop?.name}
                  </span>
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT-SIDE DESKTOP SECTION */}
          <div className="hidden lg:flex flex-col gap-4 lg:col-span-1">
            {otherViews && otherViews.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">
                  Customers Also Viewed
                </h3>

                <div className="flex flex-col gap-4">
                  {otherViews.slice(0, 2).map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.slug}`}
                      className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition"
                    >
                      <Image
                        width={20}
                        height={20}
                        src={item.images?.[1] || "/placeholder.png"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md border"
                      />

                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.title}
                        </p>

                        <p className="text-xs text-red-700 font-semibold mt-1">
                          {formatAmount(item.sales_price ?? item.regular_price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABS SECTION — NOW USING REAL BACKEND REVIEWS */}
      <ItemTabs
        description={product.description}
        reviews={reviews}
        star_rating={star_rating}
        recommended={recommended}
        frequentlyBoughtTogether={frequentlyBoughtTogether}
        customerAlsoViewed={customerAlsoViewed}
      />
    </>
  );
}
