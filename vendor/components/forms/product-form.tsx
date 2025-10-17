"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { FormFieldType } from "@/constants/formFieldType";
import useCategories from "@/hooks/useCategories";
import { useState, useRef, useMemo } from "react";
import React from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import useColor from "@/hooks/useColor";
import useSizes from "@/hooks/useSizes";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Variation {
  price: string;
  quantity: string;
  size_id: string;
  color_id: string;
}

interface ProductFormData {
  title: string;
  description: string;
  features: string;
  category_id: string; // Will be either main category or subcategory ID
  images: File[];
  // For products without variations
  sales_price?: string;
  regular_price?: string;
  quantity?: string;
  // For products with variations
  variations?: Variation[];
  // Other fields
  notify_user: boolean;
  discount_type?: string;
  discount_value?: string;
  shipping_option?: string;
  date_added?: string;
  time?: string;
  expiry_date?: string;
}

type Color = { id: number; name: string; hexcode: string };
type ColorOption = {
  id: number;
  name: string;
  hexcode: string;
  value: string;
  hex: string;
};

const SHIPPING_OPTIONS = [
  { label: "Free Shipping", value: "free" },
  { label: "Expedited Shipping", value: "expedited" },
];

// Add a fallback map for color names to hex codes
const COLOR_HEX_MAP: Record<string, string> = {
  Orange: "#FFA500",
  Black: "#000000",
  Blue: "#0057B7",
  Red: "#FF3B30",
  Purple: "#800080",
  Brown: "#964B00",
  Pink: "#FFC0CB",
  White: "#FFFFFF",
};

export function ProductForm() {
  const router = useRouter();
  const { data: shopDetails, isLoading: isLoadingShop } = useShopDetails();
  const createProductMutation = useCreateProduct();

  // Determine shop type, but only use it for categories after shop loads
  const shopType = shopDetails?.data?.type;
  const categoryType = shopType
    ? shopType === "services"
      ? "services"
      : "products"
    : "products";

  console.log("shopDetails------------------------>>", shopDetails);
  console.log("shopType------------------------>>", shopType);
  console.log("categoryType------------------------>>", categoryType);

  const { data: colorsData } = useColor();
  const { data: sizesData } = useSizes();

  // Fetch categories with the determined type
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories({
      type: categoryType,
    });

  console.log(
    "categoriesResponse------------------------>>",
    categoriesResponse
  );

  const form = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      features: "",
      category_id: "",
      images: [],
      sales_price: "",
      regular_price: "",
      quantity: "",
      variations: [],
      notify_user: true,
      discount_type: "percentage",
      discount_value: "",
      shipping_option: "",
      date_added: "",
      time: "",
      expiry_date: "",
    },
  });

  // Additional state for main category (not submitted, just for UI)
  const [mainCategory, setMainCategory] = useState<string>("");

  console.log(colorsData, "colorsData");

  // Map API data to label/value/id/hex format for the form
  const COLORS: ColorOption[] = (colorsData || []).map((color: Color) => ({
    ...color,
    value:
      color.hexcode && color.hexcode !== ""
        ? color.hexcode
        : COLOR_HEX_MAP[color.name] || color.name,
    hex:
      color.hexcode && color.hexcode !== ""
        ? color.hexcode
        : COLOR_HEX_MAP[color.name] || "#eee",
  }));

  const SIZES: { id: number; label: string; value: string }[] = (
    sizesData || []
  ).map((size: { id: number; name: string }) => {
    return {
      label: size.name,
      value: size.name,
      id: size.id,
    };
  });

  console.log(COLORS, "colors");
  console.log(SIZES, "sizes");

  // Define proper type for categories with children
  interface Category {
    id: number;
    name: string;
    children?: Array<{
      id: number;
      name: string;
    }>;
  }

  // The hook now returns the categories array directly
  const categories: Category[] = useMemo(() => categoriesResponse || [], [categoriesResponse]);

  console.log("categories------------------------>>", categories);
  console.log(
    "isLoadingCategories------------------------>>",
    isLoadingCategories
  );

  // Get subcategories based on selected main category
  const selectedCategory = categories.find(
    (cat) => cat.id.toString() === mainCategory
  );
  const subcategories = selectedCategory?.children || [];

  // When main category changes, update category_id if no subcategories
  React.useEffect(() => {
    if (mainCategory) {
      const category = categories.find(
        (cat) => cat.id.toString() === mainCategory
      );
      if (!category?.children || category.children.length === 0) {
        // No subcategories, use main category ID
        form.setValue("category_id", mainCategory);
      } else {
        // Has subcategories, clear category_id (user must select subcategory)
        form.setValue("category_id", "");
      }
    }
  }, [mainCategory, categories, form]);

  const MAX_IMAGES = 8;
  const [images, setImages] = useState<(File | null)[]>([null]);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([
    { price: "", quantity: "", size_id: "", color_id: "" },
  ]);

  const handleImageChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
    form.setValue("images", images.filter(Boolean) as File[]);
  };

  const handleBoxClick = (idx: number) => {
    fileInputs.current[idx]?.click();
  };

  const handleAddBox = () => {
    if (images.length < MAX_IMAGES) {
      setImages((prev) => [...prev, null]);
    }
  };

  // Variation handling functions
  const addVariation = () => {
    setVariations([
      ...variations,
      { price: "", quantity: "", size_id: "", color_id: "" },
    ]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (
    index: number,
    field: keyof Variation,
    value: string
  ) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Create FormData for file upload support
      const formData = new FormData();

      // Add basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("features", data.features);
      formData.append("category_id", data.category_id);
      formData.append("notify_user", data.notify_user ? "1" : "0");

      // Add images
      const validImages = images.filter(Boolean) as File[];
      validImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      if (hasVariations) {
        // Add variations
        variations.forEach((variation, index) => {
          formData.append(`variations[${index}][price]`, variation.price);
          formData.append(`variations[${index}][quantity]`, variation.quantity);
          formData.append(`variations[${index}][size_id]`, variation.size_id);
          formData.append(`variations[${index}][color_id]`, variation.color_id);
        });
      } else {
        // Add simple product fields
        if (data.regular_price)
          formData.append("regular_price", data.regular_price);
        if (data.sales_price) formData.append("sales_price", data.sales_price);
        if (data.quantity && !isService)
          formData.append("quantity", data.quantity);
      }

      // Add optional fields
      if (data.discount_type && data.discount_value) {
        formData.append("discount_type", data.discount_type);
        formData.append("discount_value", data.discount_value);
      }

      if (data.expiry_date) {
        formData.append("expiry_date", data.expiry_date);
      }

      // Submit the form
      await createProductMutation.mutateAsync(formData);

      toast.success("Product created successfully!");
      router.push("/products/manage"); // Redirect to products management page
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create product";
      console.error("Error creating product:", error);
      toast.error(errorMessage);
    }
  };

  // Show loading state while fetching shop details
  if (isLoadingShop) {
    return (
      <div className="flex-1 bg-[#F8F8F8] flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading shop details...</p>
      </div>
    );
  }

  const isService = shopType === "services" || categoryType === "services";
  const itemType = isService ? "Service" : "Product";

  return (
    <div className="flex-1 bg-[#F8F8F8]">
      <div className="flex items-center gap-4 p-8">
        <h2 className="text-xl font-semibold">Add New {itemType}</h2>
      </div>
      <FormProvider {...form}>
        <div className="px-8">
          <Card className="p-8 border-none bg-[#FFFFFF] w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <CustomFormField
                  control={form.control}
                  name="title"
                  label={`${itemType} Title`}
                  fieldType={FormFieldType.INPUT}
                  isEditable
                />
                <CustomFormField
                  control={form.control}
                  name="description"
                  label="Description"
                  fieldType={FormFieldType.RICH_TEXT}
                  isEditable
                />
                <CustomFormField
                  control={form.control}
                  name="features"
                  label="Features"
                  fieldType={FormFieldType.RICH_TEXT}
                  isEditable
                />
                {/* Main Category Selector */}
                <div>
                  <label className="block mb-1 font-medium">Category</label>
                  <Select
                    value={mainCategory}
                    onValueChange={(value) => setMainCategory(value)}
                    disabled={isLoadingCategories || categories.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? "Loading categories..."
                            : categories.length === 0
                            ? "No categories available"
                            : "Select a category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: Category) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory - only show if main category is selected and has children */}
                {mainCategory && subcategories.length > 0 && (
                  <CustomFormField
                    control={form.control}
                    name="category_id"
                    label="Subcategory"
                    fieldType={FormFieldType.SELECT}
                    placeholder="Select a subcategory"
                    options={subcategories.map(
                      (sub: { id: number; name: string }) => ({
                        label: sub.name,
                        value: sub.id.toString(),
                      })
                    )}
                    isEditable
                  />
                )}

                {/* Image Upload */}
                <div className="flex gap-4">
                  {images.map((img, idx: number) => (
                    <div
                      key={idx}
                      className="w-32 h-32 border rounded flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => handleBoxClick(idx)}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={(el) => {
                          fileInputs.current[idx] = el || null;
                        }}
                        onChange={(e) => handleImageChange(idx, e)}
                      />
                      {img ? (
                        <Image
                          src={URL.createObjectURL(img)}
                          alt={`preview-${idx}`}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <span className="text-3xl text-orange-500">+</span>
                          <span className="text-gray-500">Image</span>
                        </>
                      )}
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={handleAddBox}
                      className="w-32 h-32 border rounded flex flex-col items-center justify-center text-orange-500 text-3xl"
                    >
                      +<span className="text-gray-500 text-base">Add</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Images need to be 600x600 and 2000x2000 pixels. White
                  backgrounds are recommended. Maximum image size 2Mb
                </p>
                {/* Variation Toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasVariations}
                    onCheckedChange={setHasVariations}
                  />
                  <span className="font-medium">Enable Product Variations</span>
                </div>

                {/* Variations Section */}
                {hasVariations ? (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Product Variations</h3>
                      <Button
                        type="button"
                        onClick={addVariation}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variation
                      </Button>
                    </div>

                    {variations.map((variation, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded"
                      >
                        <div>
                          <label className="block mb-1 text-sm font-medium">
                            Color
                          </label>
                          <Select
                            value={variation.color_id}
                            onValueChange={(value) =>
                              updateVariation(index, "color_id", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {COLORS.map((color) => (
                                <SelectItem
                                  key={color.id}
                                  value={color.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-4 h-4 rounded-full border"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span>{color.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium">
                            Size
                          </label>
                          <Select
                            value={variation.size_id}
                            onValueChange={(value) =>
                              updateVariation(index, "size_id", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {SIZES.map((size) => (
                                <SelectItem
                                  key={size.id}
                                  value={size.id.toString()}
                                >
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium">
                            Price
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="0.00"
                            value={variation.price}
                            onChange={(e) =>
                              updateVariation(index, "price", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium">
                            Quantity
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="0"
                            value={variation.quantity}
                            onChange={(e) =>
                              updateVariation(index, "quantity", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => removeVariation(index)}
                            size="icon"
                            variant="destructive"
                            disabled={variations.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {/* Price and Quantity - only show when not using variations */}
                {!hasVariations && (
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      control={form.control}
                      name="regular_price"
                      label="Regular Price"
                      fieldType={FormFieldType.NUMBER}
                      isEditable
                    />
                    <CustomFormField
                      control={form.control}
                      name="sales_price"
                      label="Sales Price"
                      fieldType={FormFieldType.NUMBER}
                      isEditable
                    />
                    {!isService && (
                      <CustomFormField
                        control={form.control}
                        name="quantity"
                        label="Quantity"
                        fieldType={FormFieldType.NUMBER}
                        isEditable
                      />
                    )}
                  </div>
                )}
                {/* Discount Toggle */}
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-normal">Add Discount</span>
                  <Switch
                    checked={hasDiscount}
                    onCheckedChange={() => setHasDiscount((prev) => !prev)}
                  />
                </div>
                {hasDiscount && (
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="discount_type"
                      label="Discount Type"
                      fieldType={FormFieldType.SELECT}
                      options={[
                        { label: "Percentage", value: "percentage" },
                        { label: "Fixed", value: "fixed" },
                      ]}
                      isEditable
                    />
                    <CustomFormField
                      control={form.control}
                      name="discount_value"
                      label="Discount Value"
                      fieldType={FormFieldType.NUMBER}
                      isEditable
                    />
                  </div>
                )}
                <CustomFormField
                  control={form.control}
                  name="shipping_option"
                  label="Shipping Option"
                  fieldType={FormFieldType.SELECT}
                  options={SHIPPING_OPTIONS}
                  isEditable
                />
                <div className="flex gap-4">
                  <CustomFormField
                    control={form.control}
                    name="date_added"
                    label="Date Added"
                    fieldType={FormFieldType.DATE_PICKER}
                    isEditable
                  />
                  <CustomFormField
                    control={form.control}
                    name="time"
                    label="Time"
                    fieldType={FormFieldType.DATE_TIME_PICKER}
                    isEditable
                  />
                </div>
                {/* Expiry Date Toggle */}
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-normal">Add Expiry Date</span>
                  <Switch
                    checked={hasExpiry}
                    onCheckedChange={() => setHasExpiry((v) => !v)}
                  />
                </div>
                {hasExpiry && (
                  <CustomFormField
                    control={form.control}
                    name="expiry_date"
                    label="Expiry Date"
                    fieldType={FormFieldType.DATE_PICKER}
                    isEditable
                  />
                )}
              </div>
              <div className="flex justify-end gap-4 pt-4">
                {/* <Button
                  variant="outline"
                  type="button"
                  className="px-8 rounded-[39px] w-[213px] h-[48px]"
                >
                  Save for Later
                </Button> */}
                <SubmitButton
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="px-8 text-[#FFFFFF] w-[213px] h-[48px] rounded-[39px]"
                >
                  {createProductMutation.isPending
                    ? "Creating..."
                    : "Save & Publish"}
                </SubmitButton>
              </div>
            </form>
          </Card>
        </div>
      </FormProvider>
    </div>
  );
}
