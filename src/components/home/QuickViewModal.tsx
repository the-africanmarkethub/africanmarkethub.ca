import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, Heart, Minus, Plus } from "lucide-react";
import { Product, Size, Color, Variation } from "@/types/product.types";
import ColorSelector from "@/components/ui/color-selector";
import SizeSelector from "@/components/ui/size-selector";
import { useColors } from "@/hooks/useColors";
import { useSizes } from "@/hooks/useSizes";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import SubmitButton from "@/components/SubmitButton";
import { Badge } from "@/components/ui/badge";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  const { data: allColorsData } = useColors();
  const { data: allSizesData } = useSizes();
  const { addToCart } = useCart();

  const variations = product?.variations || [];

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product?.images]);

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

  const availableColors = useMemo(() => {
    if (!product || !allColorsData?.data) return [];
    const colorIds = [...new Set(variations.map((v: Variation) => v.color_id))];
    return allColorsData.data.filter((color: Color) =>
      colorIds.includes(color.id)
    );
  }, [product, variations, allColorsData]);

  const availableSizes = useMemo(() => {
    if (!product || !allSizesData?.data) return [];
    const sizeIds = [...new Set(variations.map((v: Variation) => v.size_id))];
    return allSizesData.data.filter((size: Size) => sizeIds.includes(size.id));
  }, [product, variations, allSizesData]);

  const disabledSizes = useMemo(() => {
    if (!selectedColor || !availableSizes.length) return [];
    const validSizeIdsForColor = variations
      .filter((v: Variation) => v.color_id === selectedColor.id)
      .map((v: Variation) => v.size_id);
    return availableSizes
      .filter((size: Size) => !validSizeIdsForColor.includes(size.id))
      .map((size: Size) => size.id);
  }, [selectedColor, variations, availableSizes]);

  const disabledColors = useMemo(() => {
    if (!selectedSize || !availableColors.length) return [];
    const validColorIdsForSize = variations
      .filter((v: Variation) => v.size_id === selectedSize.id)
      .map((v: Variation) => v.color_id);
    return availableColors
      .filter((color: Color) => !validColorIdsForSize.includes(color.id))
      .map((color: Color) => color.id);
  }, [selectedSize, variations, availableColors]);

  if (!isOpen || !product) return null;

  // Determine display values based on selection
  const hasVariations = variations.length > 0;
  const displayPrice = hasVariations
    ? selectedVariation?.price || product?.sales_price
    : product?.sales_price;
  const displayRegularPrice = hasVariations ? null : product?.regular_price;
  const displayQuantity = hasVariations
    ? (selectedVariation?.quantity ?? 0)
    : (product?.quantity ?? 0);
  const displaySku = hasVariations
    ? selectedVariation?.sku || product?.slug
    : product?.slug;
  const isInStock = displayQuantity > 0;

  // Format price safely
  const formatPrice = (price: string | number | undefined): string => {
    const numPrice =
      typeof price === "number" ? price : parseFloat(price || "0");
    return numPrice.toFixed(2);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      if (prev >= displayQuantity) {
        const variationInfo = selectedVariation
          ? ` for ${selectedColor?.name || ""} ${selectedSize?.name || ""}`.trim()
          : "";
        toast.warning(`Maximum quantity reached ${variationInfo}`, {
          description: `Only ${displayQuantity} items available in stock.`,
        });
        return prev;
      }
      return prev + 1;
    });
  };

  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;

    if (hasVariations && !selectedVariation) {
      toast.error("Please select a color and size before adding to cart.");
      return;
    }

    const itemToAdd = {
      product_id: product.id,
      quantity: quantity,
      color_id: selectedColor?.id,
      size_id: selectedSize?.id,
      product: product,
    };

    addToCart(itemToAdd);
    toast.success("Added to cart!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex gap-10 p-10">
          {/* Left side - Images */}
          <div className="relative w-[450px] h-[550px] flex-shrink-0">
            {/* Main Image */}
            {selectedImage && (
              <Image
                src={selectedImage}
                fill
                sizes="450px"
                alt={product.title}
                className="rounded-3xl object-cover"
                unoptimized
              />
            )}

            {/* Thumbnail Overlay */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.images
                ?.slice(0, 4)
                .map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
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

          {/* Right side - Product info */}
          <div className="flex-1 space-y-6">
            {/* Title and stock status */}
            <div>
              <div className="flex gap-4 items-center mb-3">
                <h2 className="text-3xl font-semibold">{product.title}</h2>
                {isInStock && (
                  <Badge className="px-4 py-2 text-sm font-normal rounded-full text-[#009900] bg-[#0099001A]">
                    In stock
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex gap-0.5 items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < product.average_rating
                          ? "text-yellow-400 text-xl"
                          : "text-gray-300 text-xl"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-[#808080] text-sm font-normal ml-1">
                    {product.average_rating || 4.0}.0
                  </span>
                </div>
                <div className="text-[#000000]">
                  ({product.reviews?.length || 0} customer reviews)
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="font-semibold text-base mb-1">Price</p>
              <div className="flex gap-4 items-center">
                <p className="font-bold text-2xl">
                  {formatPrice(displayPrice)} CAD
                </p>
                {displayRegularPrice && (
                  <p className="text-[#BDBDBD] font-normal text-lg line-through">
                    {formatPrice(displayRegularPrice)} CAD
                  </p>
                )}
                {displayRegularPrice && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    -50%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-[#656565] text-sm leading-relaxed">
              {product.description ||
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."}
            </div>

            {/* Color selection */}
            {availableColors.length > 0 && (
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
                        v.color_id === color.id && v.size_id === selectedSize.id
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
            )}

            {/* Size selection */}
            {availableSizes.length > 0 && (
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
                        v.size_id === size.id && v.color_id === selectedColor.id
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
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="rounded-full flex justify-center items-center bg-[#F8F8F8] w-[34px] h-[34px]"
                >
                  <Minus width={20} height={20} />
                </button>
                <span className="px-4 font-normal text-base">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="rounded-full flex justify-center items-center bg-[#F8F8F8] w-[34px] h-[34px]"
                >
                  <Plus width={20} height={20} />
                </button>
              </div>

              <SubmitButton
                onClick={handleAddToCart}
                disabled={!isInStock || (hasVariations && !selectedVariation)}
                className={`w-[264px] h-[54px] rounded-[32px] ${
                  !isInStock || (hasVariations && !selectedVariation)
                    ? "bg-[#bdbdbd] cursor-not-allowed"
                    : "bg-primary"
                }`}
              >
                Add to Cart
              </SubmitButton>

              <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Additional info */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <div className="text-sm">
                <p>
                  SKU:{" "}
                  <span className="text-gray-600">
                    {displaySku?.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="text-sm">
                <p>
                  Category:{" "}
                  <span className="text-gray-600">
                    {product.category?.name}
                  </span>
                </p>
              </div>
              {product.shop && (
                <div className="text-sm">
                  <p>
                    Shop:{" "}
                    <span className="text-gray-600">{product.shop.name}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
