"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProductDetail } from "@/hooks/useProductDetail";
import { ItemCard } from "@/components/ItemCard";
import { useAddToCart } from "@/hooks/useCart";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: productData, isLoading, error } = useProductDetail(slug);
  const addToCart = useAddToCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData || !productData.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <button className="bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const product = productData.data.product;
  const relatedProducts = productData.data.frequently_bought_together;
  const recommendedProducts = productData.data.recommended;
  const otherViewsProducts = productData.data.otherViews;
  const starRating = productData.data.star_rating;
  const hasDiscount =
    parseFloat(product.regular_price) > parseFloat(product.sales_price);
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.regular_price) - parseFloat(product.sales_price)) /
          parseFloat(product.regular_price)) *
          100
      )
    : 0;

  const handleQuantityChange = (action: "increment" | "decrement") => {
    if (action === "increment" && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    addToCart.mutate(
      {
        cart_items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      },
      {
        onSuccess: (data) => {
          if (data.message) {
            toast.success(data.message);
          } else {
            toast.success("Item added to cart successfully!");
          }
        },
        onError: (error: any) => {
          console.error("Add to cart failed:", error);

          // Handle API errors
          if (error?.errors) {
            const apiErrors = error.errors;
            Object.keys(apiErrors).forEach((field) => {
              const messages = apiErrors[field];
              if (Array.isArray(messages)) {
                messages.forEach((message: string) => {
                  toast.error(message);
                });
              } else if (typeof messages === "string") {
                toast.error(messages);
              }
            });
          } else if (error?.message) {
            toast.error(error.message);
          } else {
            toast.error("Failed to add item to cart. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#F28C0D]">
              Home
            </Link>
            <span>›</span>
            <Link href="/recommended" className="hover:text-[#F28C0D]">
              Category
            </Link>
            <span>›</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - ~33% width */}
          <div className="lg:col-span-4 space-y-4">
            <div className="aspect-[2/3] rounded-[32px] overflow-hidden bg-white shadow-sm">
              <Image
                src={product.images[selectedImageIndex] || "/icon/auth.svg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-[#F28C0D]"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - ~42% width */}
          <div className="lg:col-span-5 space-y-7">
            <div className="">
              <h1 className="text-[28px] flex gap-4  items-center font-bold text-gray-900">
                {product.title}{" "}
                <span>
                  {product.quantity > 0 ? (
                    <span className="text-green-600 text-sm">✓ In Stock</span>
                  ) : (
                    <span className="text-red-600 text-sm">✗ Out of Stock</span>
                  )}
                </span>
              </h1>
              <div className="flex items-center text-sm space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.average_rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.average_rating.toFixed(1)} ({starRating.total}{" "}
                  Customer reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Price</div>
              <div className="flex items-center space-x-3">
                <span className="text-[28px] font-medium text-gray-900">
                  ${parseFloat(product.sales_price).toFixed(2)} CAD
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${parseFloat(product.regular_price).toFixed(2)} CAD
                    </span>
                    <span className="bg-red-500 text-white text-xs px-1 py-1 rounded">
                      {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.variations && product.variations.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-gray-900 mb-2">
                  Color: {product.variations[0]?.color?.name || "Select Color"}
                </h3>
                <div className="flex space-x-2">
                  {product.variations.map((variation, index) => (
                    <button
                      key={variation.id}
                      className={`w-4 h-4 rounded-full border-2 ${
                        index === 0 ? "border-gray-900" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: variation.color.hexcode }}
                      title={variation.color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.variations && product.variations.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-gray-900 mb-2">
                  Size: {product.variations[0]?.size?.name || "Select Size"}
                </h3>
                <div className="flex space-x-2">
                  {product.variations.map((variation, index) => (
                    <button
                      key={variation.id}
                      className={`px-1 py-1 border rounded-full text-xs font-medium ${
                        index === 0
                          ? "bg-[#F28C0D] text-white border-[#F28C0D]"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {variation.size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <div
                className="text-gray-600 text-xs prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Quantity & Add to Cart */}
            {product.quantity > 0 && (
              <div className="space-y-4 text-black w-full flex space-x-4 items-center">
                <div className="flex items-center space-x-4">
                  {/* <span className="font-medium">Quantity:</span> */}
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="px-3 py-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="px-3 py-2 hover:bg-gray-100"
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex w-full space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                    className="flex-1 bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    {addToCart.isPending ? "Adding..." : "Add to Cart"}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    ♡
                  </button>
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="border-t pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className=" text-[#292929]">SKU:</span>
                <span className="text-[#464646]">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className=" text-[#292929]">Category:</span>
                <span className="text-[#464646]">
                  {product.type === "services" ? "Services" : "Products"}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar - Delivery, Seller Info, Reviews - ~25% width */}
          <div className="lg:col-span-3">
            {/* Delivery & Return Policy */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Delivery & Return Policy
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="text-[#F28C0D] mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Estimated delivery time: 1-9 business days
                    </p>
                    <p className="text-xs text-gray-500">
                      Express Delivery Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Return Policy
              </h3>
              <div className="flex text-xs items-start space-x-3">
                <div className="text-[#F28C0D] mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Seller Information
                </h3>
                {/* <Link
                  href={`/shop/${product.shop.slug}`}
                  className="text-[#F28C0D] text-xs hover:underline"
                >
                  View Shop
                </Link> */}
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={product.shop.logo}
                    alt={product.shop.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {product.shop.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.shop.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.shop.description.substring(0, 100)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Summary */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Abstergo Ltd.
                    </p>
                    <p className="text-xs text-gray-500">
                      90% Positive Feedback | 150 Followers
                    </p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Seller Rating
                  </p>
                  <div className="flex text-xs items-center space-x-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Reviews Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "description"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "reviews"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews ({starRating.total})
              </button>
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {product.title}
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-600 mb-8"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                {/* Product Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">
                        Category:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {product.category.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Type:</span>
                      <span className="ml-2 text-gray-600">{product.type}</span>
                    </div>
                    {product.weight && (
                      <div>
                        <span className="font-medium text-gray-900">
                          Weight:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {product.weight} {product.weight_unit}
                        </span>
                      </div>
                    )}
                    {product.height && product.width && product.length && (
                      <div>
                        <span className="font-medium text-gray-900">
                          Dimensions:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {product.height} × {product.width} × {product.length}{" "}
                          {product.size_unit || "cm"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Customer Reviews
                </h3>
                {starRating.reviews && starRating.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {starRating.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {review.user?.name?.charAt(0) || "A"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {review.user?.name || "Anonymous User"}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h6a2 2 0 002-2V8"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to review this{" "}
                      {product.type === "services" ? "service" : "product"}!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently bought together
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => {
                const hasRelatedDiscount =
                  parseFloat(relatedProduct.regular_price) >
                  parseFloat(relatedProduct.sales_price);
                const relatedDiscountPercentage = hasRelatedDiscount
                  ? Math.round(
                      ((parseFloat(relatedProduct.regular_price) -
                        parseFloat(relatedProduct.sales_price)) /
                        parseFloat(relatedProduct.regular_price)) *
                        100
                    )
                  : 0;

                return (
                  <ItemCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    title={relatedProduct.title}
                    slug={relatedProduct.slug}
                    price={`$${parseFloat(relatedProduct.sales_price).toFixed(
                      2
                    )} CAD`}
                    originalPrice={
                      hasRelatedDiscount
                        ? `$${parseFloat(relatedProduct.regular_price).toFixed(
                            2
                          )} CAD`
                        : undefined
                    }
                    rating={relatedProduct.average_rating || 5}
                    image={relatedProduct.images[0] || "/icon/auth.svg"}
                    discount={
                      hasRelatedDiscount
                        ? `${relatedDiscountPercentage}% off`
                        : undefined
                    }
                    type={
                      relatedProduct.type === "services" ? "service" : "product"
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Recommended for You - Carousel */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Recommended for You
            </h2>
            <div className="relative overflow-hidden">
              <div className="flex space-x-4 pb-4" style={{ animation: 'scroll 20s linear infinite' }}>
                {[...recommendedProducts, ...recommendedProducts].map((recommendedProduct, index) => {
                  const hasRecommendedDiscount =
                    parseFloat(recommendedProduct.regular_price) >
                    parseFloat(recommendedProduct.sales_price);
                  const recommendedDiscountPercentage = hasRecommendedDiscount
                    ? Math.round(
                        ((parseFloat(recommendedProduct.regular_price) -
                          parseFloat(recommendedProduct.sales_price)) /
                          parseFloat(recommendedProduct.regular_price)) *
                          100
                      )
                    : 0;

                  return (
                    <div key={`${recommendedProduct.id}-${index}`} className="flex-none w-64">
                      <ItemCard
                        id={recommendedProduct.id}
                        title={recommendedProduct.title}
                        slug={recommendedProduct.slug}
                        price={`$${parseFloat(recommendedProduct.sales_price).toFixed(2)} CAD`}
                        originalPrice={
                          hasRecommendedDiscount
                            ? `$${parseFloat(recommendedProduct.regular_price).toFixed(2)} CAD`
                            : undefined
                        }
                        rating={recommendedProduct.average_rating || 5}
                        image={recommendedProduct.images[0] || "/icon/auth.svg"}
                        discount={
                          hasRecommendedDiscount
                            ? `${recommendedDiscountPercentage}% off`
                            : undefined
                        }
                        type={recommendedProduct.type === "services" ? "service" : "product"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Customer who viewed this also viewed */}
        {otherViewsProducts && otherViewsProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Customer who viewed this also viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {otherViewsProducts.slice(0, 10).map((otherProduct) => {
                const hasOtherDiscount =
                  parseFloat(otherProduct.regular_price) >
                  parseFloat(otherProduct.sales_price);
                const otherDiscountPercentage = hasOtherDiscount
                  ? Math.round(
                      ((parseFloat(otherProduct.regular_price) -
                        parseFloat(otherProduct.sales_price)) /
                        parseFloat(otherProduct.regular_price)) *
                        100
                    )
                  : 0;

                return (
                  <ItemCard
                    key={otherProduct.id}
                    id={otherProduct.id}
                    title={otherProduct.title}
                    slug={otherProduct.slug}
                    price={`$${parseFloat(otherProduct.sales_price).toFixed(2)} CAD`}
                    originalPrice={
                      hasOtherDiscount
                        ? `$${parseFloat(otherProduct.regular_price).toFixed(2)} CAD`
                        : undefined
                    }
                    rating={otherProduct.average_rating || 5}
                    image={otherProduct.images[0] || "/icon/auth.svg"}
                    discount={
                      hasOtherDiscount
                        ? `${otherDiscountPercentage}% off`
                        : undefined
                    }
                    type={otherProduct.type === "services" ? "service" : "product"}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
