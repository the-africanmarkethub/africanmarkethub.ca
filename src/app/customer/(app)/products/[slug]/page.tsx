"use client";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import SubmitButton from "@/components/customer/SubmitButton";
import ProductsDisplay from "@/components/customer/product/ProductsDisplay";
import RecommendedProductCarousel from "@/components/customer/product/RecommendedProductCarousel";
import TabSwitcher from "@/components/customer/product/TabSwitcher";
import ProductPageSkeleton from "@/components/customer/ProductPageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/customer/useProduct";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import WishlistButton from "@/components/customer/WishlistButton";
import ColorSelector from "@/components/ui/color-selector";
import SizeSelector from "@/components/ui/size-selector";
import { Color, Size, Variation } from "@/types/customer/product.types";
import { toast } from "sonner";
import { useCart } from "@/contexts/customer/CartContext";
import { useUser } from "@/hooks/customer/useUser";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;

  const searchParams = useSearchParams();
  const categoryName = searchParams.get("categoryName");
  const validCategoryName = categoryName === "undefined" ? undefined : categoryName;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [initiatedGoogleAuth, setInitiatedGoogleAuth] = useState(false);

  const {
    data: productData,
    isFetching: isProductLoading,
    error: productError,
    status,
  } = useProduct(slug);
  const { addToCart } = useCart();
  const { data: user } = useUser();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const product = productData?.product;
  const variations = useMemo(
    () => product?.variations || [],
    [product?.variations]
  );

  console.log(variations);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product?.images]);

  // Handle Google authentication callback - redirect to chats after successful auth
  useEffect(() => {
    if (
      session?.accessToken &&
      product?.type === "services" &&
      initiatedGoogleAuth
    ) {
      // Invalidate user queries to refresh the user data (same as normal login)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.user] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.profile] });

      toast.success("Successfully authenticated with Google!");
      router.push("/account/chats");
      setInitiatedGoogleAuth(false); // Reset the flag
    }
  }, [session, product?.type, router, initiatedGoogleAuth, queryClient]);

  // Find the selected variation based on color and size
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variation = variations.find(
        (v: Variation) =>
          v.color_id === selectedColor.id && v.size_id === selectedSize.id
      );
      setSelectedVariation(variation || null);
    } else {
      setSelectedVariation(null);
    }
  }, [selectedColor, selectedSize, variations]);

  // Reset quantity when variation changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariation]);

  // Extract unique colors from variations
  const availableColors = useMemo(() => {
    if (!variations.length) return [];
    const colorMap = new Map<number, Color>();

    variations.forEach((variation: Variation) => {
      if (variation.color && variation.color_id) {
        colorMap.set(variation.color_id, variation.color);
      }
    });

    return Array.from(colorMap.values());
  }, [variations]);

  // Extract unique sizes from variations
  const availableSizes = useMemo(() => {
    if (!variations.length) return [];
    const sizeMap = new Map<number, Size>();

    variations.forEach((variation: Variation) => {
      if (variation.size && variation.size_id) {
        sizeMap.set(variation.size_id, variation.size);
      }
    });

    return Array.from(sizeMap.values());
  }, [variations]);

  // Calculate disabled sizes based on selected color
  const disabledSizes = useMemo(() => {
    if (!selectedColor || !availableSizes.length) return [];
    const validSizeIdsForColor = variations
      .filter((v: Variation) => v.color_id === selectedColor.id)
      .map((v: Variation) => v.size_id);
    return availableSizes
      .filter((size: Size) => !validSizeIdsForColor.includes(size.id))
      .map((size: Size) => size.id);
  }, [selectedColor, variations, availableSizes]);

  // Calculate disabled colors based on selected size
  const disabledColors = useMemo(() => {
    if (!selectedSize || !availableColors.length) return [];
    const validColorIdsForSize = variations
      .filter((v: Variation) => v.size_id === selectedSize.id)
      .map((v: Variation) => v.color_id);
    return availableColors
      .filter((color: Color) => !validColorIdsForSize.includes(color.id))
      .map((color: Color) => color.id);
  }, [selectedSize, variations, availableColors]);

  // Determine display values based on selection

  const hasVariations = variations.length > 0;

  // Pricing logic: If sales_price is 0 or empty, use regular_price
  const getEffectivePrice = (salesPrice: string, regularPrice: string) => {
    const sales = parseFloat(salesPrice || "0");
    const regular = parseFloat(regularPrice || "0");
    return sales > 0 ? sales : regular;
  };

  const displayPrice = hasVariations
    ? selectedVariation?.price ||
      getEffectivePrice(
        product?.sales_price || "0",
        product?.regular_price || "0"
      )
    : getEffectivePrice(
        product?.sales_price || "0",
        product?.regular_price || "0"
      );

  const displayRegularPrice = hasVariations
    ? null
    : parseFloat(product?.sales_price || "0") > 0
      ? product?.regular_price
      : null;

  const displayQuantity = hasVariations
    ? (selectedVariation?.quantity ?? 0)
    : (product?.quantity ?? 0);
  const displaySku = hasVariations
    ? selectedVariation?.sku || product?.slug
    : product?.slug;
  const isInStock = product?.type === "services" ? true : displayQuantity > 0;

  const increaseQuantity = () => {
    setQuantity((prev) => {
      // Prevent increasing quantity beyond available stock
      if (prev >= displayQuantity) {
        const variationInfo = selectedVariation
          ? ` for ${selectedColor?.name || ""} ${selectedSize?.name || ""}`.trim()
          : "";

        toast.warning(`Maximum quantity reached  ${variationInfo}`, {
          description: `Only ${displayQuantity} items available in stock. You cannot add more than this quantity.`,
        });
        return prev;
      }
      return prev + 1;
    });
  };

  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // When selected variation changes, reset quantity or cap it at max available
  useEffect(() => {
    if (displayQuantity > 0) {
      setQuantity((prev) => Math.min(prev, displayQuantity));
    } else {
      setQuantity(1);
    }
  }, [selectedVariation, displayQuantity]);

  const handleAddToCart = () => {
    if (!product) return;

    // Handle services differently
    if (product.type === "services") {
      // Check if user is authenticated
      if (!user) {
        // User not authenticated - redirect to Google sign-in
        setInitiatedGoogleAuth(true); // Set flag before redirecting
        signIn("google", {
          callbackUrl: `/products/${product.slug}`, // Return to this product page after login
        });
        return;
      }

      // User is already authenticated - just redirect to chats (no Google auth needed)
      router.push("/account/chats");
      return;
    }

    // Handle regular products (add to cart) - only check variations for non-services
    if (product.type !== "services" && hasVariations && !selectedVariation) {
      toast.error("Please select a color and size before adding to cart.");
      return;
    }

    const itemToAdd = {
      product_id: product.id,
      quantity: quantity,
      color_id: selectedColor?.id,
      size_id: selectedSize?.id,
      product: product, // Include full product data for guest cart
    };

    addToCart(itemToAdd);
  };

  if (isProductLoading) {
    return <ProductPageSkeleton />;
  }

  if (status === "error") {
    return <span>Error: {productError?.message}</span>;
  }
  const frequentlyBoughtProducts = productData?.frequently_bought_together;
  const customerViews = productData?.otherViews;

  return (
    <>
      {product && (
        <MaxWidthWrapper className="mt-12 md:mt-[26px] mb-10 md:mb-20">
          <div className="flex text-xs md:text-sm text-[#292929] font-normal gap-1 items-center mb-4">
            <p className="text-gray-500">Home</p>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <p className="text-gray-500">
              {product.category?.name || validCategoryName}
            </p>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <p className="font-medium">{product.title}</p>
          </div>
          <div className="space-y-8 w-full md:space-y-20">
            <div className="flex flex-col md:flex-row mt-4 md:mt-[46px] gap-4 w-full">
              {/* Image Gallery with Thumbnails Overlay */}
              <div className="relative w-full md:w-[450px] aspect-[327/270] md:aspect-[450/642] md:h-[642px]">
                {/* Main Image */}
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    alt="Selected product image"
                    className="rounded-[16px] md:rounded-[32px] object-cover"
                    unoptimized
                  />
                )}

                {/* Thumbnails Overlay */}
                <div className="absolute left-2 md:left-4 top-2 md:top-4 flex flex-col gap-2">
                  {product.images?.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === image
                          ? "border-white shadow-lg scale-105"
                          : "border-white/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        fill
                        alt={`Product thumbnail ${index + 1}`}
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 md:space-y-8 w-full md:w-[515px]">
                <div>
                  <div className="flex gap-4 items-center">
                    <h1 className="text-base md:text-[28px] font-semibold">
                      {product.title}
                    </h1>
                    {isInStock && (
                      <Badge className="p-0 text-[10px] md:text-sm font-normal rounded-4xl px-4 py-2 text-[#009900] bg-[#0099001A]">
                        In stock
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-6 text-[10px] md:text-sm">
                    {product.average_rating > 0 ? (
                      <div className="flex gap-0.5 items-center text-yellow-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={
                              index < product.average_rating
                                ? "text-yellow-400 text-base md:text-2xl"
                                : "text-gray-300 text-base md:text-2xl"
                            }
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-[#808080] text-[10px] md:text-sm font-normal">
                          {product.average_rating}.0
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-0.5 items-center text-gray-300">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className="text-gray-300 text-base md:text-2xl"
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-[#808080] text-[10px] md:text-sm font-normal">
                          No rating
                        </span>
                      </div>
                    )}
                    <div className="text-[#000000]">
                      (
                      {product.reviews.length <= 0 ? 0 : product.reviews.length}{" "}
                      customer reviews )
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[10px] md:text-base leading-[13px] md:leading-5">
                    Price
                  </p>
                  <div className="flex gap-2 md:gap-4 items-center">
                    <p className="font-semibold md:font-bold text-base md:text-2xl leading-[31.92px] md:leading-8">
                      {displayPrice} CAD
                    </p>
                    {displayRegularPrice && (
                      <p className="text-[#BDBDBD] font-normal text-base md:text-[18px] leading-[22px] md:leading-8 line-through">
                        {displayRegularPrice} CAD
                      </p>
                    )}
                    {displayRegularPrice && (
                      <span className="md:hidden bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full">
                        -
                        {Math.round(
                          ((parseFloat(String(displayRegularPrice || "0")) -
                            parseFloat(String(displayPrice || "0"))) /
                            parseFloat(String(displayRegularPrice || "1"))) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>
                </div>
                <div className="md:block hidden">
                  <div className="text-[#656565] text-sm prose max-w-none">
                    {product.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    ) : (
                      <p>No description available for this product.</p>
                    )}
                  </div>
                </div>

                {/* Hide color and size selectors for services */}
                {product.type !== "services" && (
                  <>
                    <ColorSelector
                      colors={availableColors}
                      disabledColors={disabledColors}
                      selectedColor={selectedColor?.id}
                      onColorSelect={(color) => {
                        setSelectedColor(color);
                        // Reset size if the new color doesn't support it
                        if (selectedSize) {
                          const isSizeAvailable = variations.some(
                            (v: Variation) =>
                              v.color_id === color.id &&
                              v.size_id === selectedSize.id
                          );
                          if (!isSizeAvailable) {
                            setSelectedSize(null);
                            setSelectedVariation(null);
                          }
                        }
                      }}
                      variant="swatches"
                      showLabel={true}
                    />
                    <SizeSelector
                      sizes={availableSizes}
                      disabledSizes={disabledSizes}
                      selectedSize={selectedSize?.id}
                      onSizeSelect={(size) => {
                        setSelectedSize(size);
                        // Reset color if the new size doesn't support it
                        if (selectedColor) {
                          const isColorAvailable = variations.some(
                            (v: Variation) =>
                              v.size_id === size.id &&
                              v.color_id === selectedColor.id
                          );
                          if (!isColorAvailable) {
                            setSelectedColor(null);
                            setSelectedVariation(null);
                          }
                        }
                      }}
                      variant="text-pills"
                      showLabel={true}
                    />
                  </>
                )}

                {/* add quantity to cart - hide for services */}
                <div className="flex flex-row items-center gap-4">
                  {product.type !== "services" && (
                    <div className="flex items-center justify-between md:justify-start">
                      <div className="flex items-center rounded-lg">
                        <button
                          onClick={decreaseQuantity}
                          className="rounded-full flex justify-center items-center bg-[#F8F8F8] w-8 h-8 md:w-[34px] md:h-[34px]"
                        >
                          <Minus
                            width={16}
                            height={16}
                            className="md:w-5 md:h-5"
                          />
                        </button>
                        <span className="px-3 md:px-4 font-normal text-base leading-[22px]">
                          {quantity}
                        </span>
                        <button
                          onClick={increaseQuantity}
                          className="rounded-full flex justify-center items-center bg-[#F8F8F8] w-8 h-8 md:w-[34px] md:h-[34px]"
                        >
                          <Plus
                            width={16}
                            height={16}
                            className="md:w-5 md:h-5"
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  <SubmitButton
                    onClick={handleAddToCart}
                    disabled={
                      !isInStock ||
                      (product.type !== "services" &&
                        hasVariations &&
                        !selectedVariation)
                    }
                    className={`w-[139px] h-7 md:w-[264px] md:h-[54px] rounded-full md:rounded-[32px] ${
                      !isInStock ||
                      (product.type !== "services" &&
                        hasVariations &&
                        !selectedVariation)
                        ? "bg-[#bdbdbd] cursor-not-allowed"
                        : "bg-primary"
                    }`}
                  >
                    {product.type === "services" ? "Book Now" : "Add to Cart"}
                  </SubmitButton>

                  <WishlistButton
                    productId={product.id}
                    variant="outline"
                    size="lg"
                    className="hidden md:flex w-[84px] h-[54px]"
                  />

                  {/* Mobile Wishlist */}
                  <WishlistButton
                    productId={product.id}
                    variant="outline"
                    size="lg"
                    className="w-7 h-7 md:hidden rounded-full"
                  />
                </div>

                <Separator />

                <div className="text-sm md:text-base">
                  <p>
                    SKU: <span className="text-gray-600">{displaySku}</span>
                  </p>
                  <p className="mt-2">
                    Category:{" "}
                    <span className="text-gray-600">
                      {product.category?.name || validCategoryName}
                    </span>
                  </p>
                </div>
              </div>

              <div className="hidden md:block w-full border-[3px] border-[#F8F8F8] rounded-2xl">
                <div className="p-4">
                  <div className="p-2">
                    <p className="text-[#1A1A1A] font-medium text-base leading-[22px]">
                      Delivery & Return Policy
                    </p>
                  </div>
                  <div className="flex gap-2 py-2">
                    <Image
                      src="/assets/icons/truck.svg"
                      width={24}
                      height={24}
                      alt="delivery"
                      className="self-start"
                    />
                    <p className="text-xs">
                      Estimated delivery time 1-9 business days <br /> Express
                      Delivery Available
                    </p>
                  </div>
                </div>

                <Separator className="w-full px-0" />

                <div className="p-4">
                  <div className="p-2">
                    <p className="text-[#1A1A1A] font-medium text-base leading-[22px]">
                      Return Policy
                    </p>
                  </div>
                  <div className="flex gap-2 py-2">
                    <Image
                      src="/assets/icons/refresh-ccw.svg"
                      width={24}
                      height={24}
                      alt="delivery"
                      className="self-start"
                    />
                    <p className="text-xs">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>

                <Separator className="w-full px-0" />

                <div className="p-4">
                  <div className="flex p-2">
                    <p className="text-[#1A1A1A] w-full font-medium text-base leading-[22px]">
                      Seller Information
                    </p>
                    <SubmitButton className="w-[61px] h-[22px] leading-[14px] text-[10px] rounded-4xl">
                      View Shop
                    </SubmitButton>
                  </div>

                  {/* Shop Header with Logo and Name */}
                  <div className="flex gap-3 py-3">
                    <Image
                      src={product.shop.logo || "/assets/default.png"}
                      width={40}
                      height={40}
                      alt="Shop logo"
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-[#1A1A1A] font-medium text-base leading-[22px]">
                        {product.shop.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {product.shop.type} Store
                      </p>
                    </div>
                  </div>

                  {/* Shop Description */}
                  {product.shop.description && (
                    <div className="py-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {product.shop.description}
                      </p>
                    </div>
                  )}

                  {/* Shop Address */}
                  {product.shop.address && (
                    <div className="py-2 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 mt-0.5">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            Location
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.shop.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shop Status */}
                  <div className="py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.shop.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {product.shop.status === "active"
                          ? "Active Store"
                          : "Inactive Store"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button className="flex-1 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                    Description
                  </button>
                  <button className="flex-1 py-3 text-sm font-medium text-gray-500">
                    Reviews
                  </button>
                </div>
              </div>
              <div className="py-4">
                <div className="text-[#656565] text-sm prose max-w-none">
                  {product.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p>No description available for this product.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <TabSwitcher product={product} />
            </div>

            <ProductsDisplay
              title="Frequently bought together"
              fontSize="text-[28px]"
              data={frequentlyBoughtProducts}
              hasButton={true}
            />

            <RecommendedProductCarousel data={frequentlyBoughtProducts} />

            <ProductsDisplay
              title="Customer who viewed this also viewed"
              fontSize="text-[28px]"
              data={customerViews}
              hasButton={true}
              showViewMore={false}
            />
          </div>
        </MaxWidthWrapper>
      )}
    </>
  );
}
