"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/vendor/ui/button";
import { Card } from "@/components/vendor/ui/card";
import CustomFormField from "@/components/vendor/CustomFormField";
import SubmitButton from "@/components/vendor/SubmitButton";
import { FormFieldType } from "@/constants/vendor/formFieldType";
import useCategories from "@/hooks/vendor/useCategories";
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
} from "@/components/vendor/ui/select";
import { Trash2, Plus, ArrowLeft, Edit } from "lucide-react";
import useColor from "@/hooks/vendor/useColor";
import useSizes from "@/hooks/vendor/useSizes";
import { useShopDetails } from "@/hooks/vendor/useShopDetails";
import { useCreateProduct } from "@/hooks/vendor/useCreateProduct";
import { useProduct } from "@/hooks/vendor/useProduct";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Variation {
  price: string;
  quantity: string;
  size_id: string;
  color_id: string;
}

interface ApiVariation {
  price: number | string;
  quantity: number | string;
  size_id: number | string;
  color_id: number | string;
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
  // Service-specific fields
  pricing_model?: string;
  delivery_method?: string;
  estimated_delivery_time?: string;
  available_days?: string[];
  available_from?: string;
  available_to?: string;
  // Other fields
  notify_user: boolean;
}

type Color = { id: number; name: string; hexcode: string };
type ColorOption = {
  id: number;
  name: string;
  hexcode: string;
  value: string;
  hex: string;
};

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
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const productSlug = searchParams.get('slug');
  const mode = searchParams.get('mode');
  const isViewMode = mode === 'view';
  
  const { data: shopDetails, isLoading: isLoadingShop } = useShopDetails();
  const createProductMutation = useCreateProduct();
  
  // Fetch product data if productSlug is provided (for view/edit mode)
  const { data: productData, isLoading: isLoadingProduct } = useProduct(
    productSlug || ""
  );

  // Determine shop type, but only use it for categories after shop loads
  const shopType = shopDetails?.shops?.[0]?.type;
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
      // Service-specific defaults
      pricing_model: "fixed",
      delivery_method: "online",
      estimated_delivery_time: "",
      available_days: [],
      available_from: "",
      available_to: "",
      // Other defaults
      notify_user: true,
    },
  });

  // Additional state for main category (not submitted, just for UI)
  const [mainCategory, setMainCategory] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

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
  const categories: Category[] = useMemo(
    () => categoriesResponse || [],
    [categoriesResponse]
  );

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

      // Update form with the new images array
      const validImages = updated.filter(Boolean) as File[];
      form.setValue("images", validImages);

      return updated;
    });

    // Clear image validation errors when a new image is selected
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors["images.0"];
      delete newErrors["images"];
      return newErrors;
    });
  };

  const handleBoxClick = (idx: number) => {
    fileInputs.current[idx]?.click();
  };

  const handleAddBox = () => {
    if (images.length < MAX_IMAGES) {
      setImages((prev) => [...prev, null]);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      const finalUpdated = updated.length > 0 ? updated : [null]; // Ensure at least one slot

      // Update form with the new images array
      const validImages = finalUpdated.filter(Boolean) as File[];
      form.setValue("images", validImages);

      return finalUpdated;
    });

    // Clear image validation errors when image is removed
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors["images.0"];
      delete newErrors["images"];
      return newErrors;
    });
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
      // Clear previous validation errors
      setValidationErrors({});

      // Create FormData directly to handle files properly
      const formData = new FormData();

      // Add basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("features", data.features);
      formData.append("category_id", data.category_id);
      formData.append("notify_user", data.notify_user ? "1" : "0");

      // Add images from current state
      const validImages = images.filter(Boolean) as File[];
      if (validImages.length === 0) {
        toast.error("Please add at least one image");
        return;
      }

      validImages.forEach((image, index) => {
        console.log(
          `Adding image[${index}]:`,
          image.name,
          image.type,
          image.size
        );
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

      // Add quantity for services (required by backend)
      if (isService && data.quantity) {
        formData.append("quantity", data.quantity);
      }

      // Add service-specific fields if it's a service
      if (isService) {
        // Validate required service fields
        if (!data.estimated_delivery_time) {
          toast.error("Estimated delivery time is required for services");
          return;
        }
        if (!data.available_days || data.available_days.length === 0) {
          toast.error("Please select at least one available day");
          return;
        }
        if (!data.available_from) {
          toast.error("Available from time is required");
          return;
        }
        if (!data.available_to) {
          toast.error("Available to time is required");
          return;
        }

        if (data.pricing_model)
          formData.append("pricing_model", data.pricing_model);
        if (data.delivery_method)
          formData.append("delivery_method", data.delivery_method);
        formData.append(
          "estimated_delivery_time",
          data.estimated_delivery_time
        );
        formData.append("available_days", JSON.stringify(data.available_days));
        formData.append("available_from", data.available_from);
        formData.append("available_to", data.available_to);
      }

      // Submit FormData directly to API using APICall
      await createProductMutation.mutateAsync(formData);

      toast.success(`${itemType} created successfully!`);
      router.push("/vendor/products/manage"); // Redirect to products management page
    } catch (error) {
      console.error("Error creating product:", error);

      // Handle validation errors from API
      const apiError = error as {
        response?: {
          data?: { errors?: Record<string, string[]>; message?: string };
        };
        message?: string;
      };
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        setValidationErrors(errors); // Store validation errors for display

        // Create better error messages
        const errorCount = Object.keys(errors).length;
        const errorMessages = Object.entries(errors).map(
          ([field, messages]) => {
            const fieldName = field.replace(/_/g, " ").replace(".", " ");
            return `${fieldName}: ${(messages as string[])[0]}`;
          }
        );

        // Show user-friendly toast message
        if (errorCount === 1) {
          toast.error(errorMessages[0]);
        } else {
          toast.error(
            `Please fix ${errorCount} validation errors. Check the form fields below.`
          );
        }
      } else if (apiError?.message) {
        toast.error(apiError.message);
      } else {
        toast.error(`Failed to create ${itemType.toLowerCase()}`);
      }
    }
  };

  const isService = shopType === "services" || categoryType === "services";
  const itemType = isService ? "Service" : "Product";

  // Set default quantity for services
  React.useEffect(() => {
    if (isService && !form.getValues("quantity")) {
      form.setValue("quantity", "1");
    }
  }, [isService, form]);

  // Populate form with existing product data for view/edit mode
  React.useEffect(() => {
    if (productData && productSlug) {
      const product = productData;
      
      // Reset form with product data
      form.reset({
        title: product.title || "",
        description: product.description || "",
        features: product.features || "",
        category_id: product.category_id?.toString() || "",
        regular_price: product.regular_price || "",
        sales_price: product.sales_price || "",
        quantity: product.quantity?.toString() || "",
        notify_user: product.notify_user === 1,
        images: [], // Images will be handled separately
        // Service-specific fields
        pricing_model: product.pricing_model || "",
        delivery_method: product.delivery_method || "",
        estimated_delivery_time: product.estimated_delivery_time || "",
        available_days: product.available_days || [],
        available_from: product.available_from || "",
        available_to: product.available_to || "",
      });

      // Handle variations if they exist
      if (product.variations && product.variations.length > 0) {
        setHasVariations(true);
        setVariations(product.variations.map((v: ApiVariation) => ({
          price: v.price?.toString() || "",
          quantity: v.quantity?.toString() || "",
          size_id: v.size_id?.toString() || "",
          color_id: v.color_id?.toString() || "",
        })));
      }

      // Handle images - convert URLs to display (for view mode)
      if (product.images && product.images.length > 0) {
        // Note: In view/edit mode, we display existing images but don't preload as File objects
        // The user would need to re-upload images if they want to change them
      }
    }
  }, [productData, productSlug, form]);

  // Clear validation errors when fields are updated
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && Object.keys(validationErrors).length > 0) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          // Clear the specific field error
          delete newErrors[name];
          // Also clear related errors (e.g., category_id clears category errors)
          if (name === "category_id") {
            delete newErrors["category_id"];
          }
          return newErrors;
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, validationErrors]);

  // Show loading state while fetching data
  if (isLoadingShop || (productSlug && isLoadingProduct)) {
    return (
      <div className="flex-1 bg-[#F8F8F8] flex items-center justify-center h-screen">
        <p className="text-gray-500">
          {isLoadingShop ? "Loading shop details..." : "Loading product data..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8F8F8]">
      <div className="flex items-center gap-4 p-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/vendor/products/manage")}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">
          {isViewMode ? `View ${itemType}` : `Add New ${itemType}`}
        </h2>
        {isViewMode && (
          <Button
            variant="outline"
            onClick={() => {
              const newUrl = `/vendor/products/new?slug=${productSlug}&mode=edit`;
              router.push(newUrl);
            }}
            className="ml-auto border-[#F28C0D] text-[#F28C0D] hover:bg-[#F28C0D] hover:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit {itemType}
          </Button>
        )}
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
                      {categories && categories.length > 0 ? (
                        categories.map((c: Category) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-8 py-4 text-center text-muted-foreground text-sm">
                          No categories available
                        </div>
                      )}
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
                {validationErrors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.category_id[0]}
                  </p>
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
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(img)}
                            alt={`preview-${idx}`}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
                {validationErrors["images.0"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors["images.0"][0]}
                  </p>
                )}
                {/* Variation Toggle - only show for products, not services */}
                {!isService && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hasVariations}
                      onCheckedChange={setHasVariations}
                    />
                    <span className="font-medium">
                      Enable Product Variations
                    </span>
                  </div>
                )}

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

                {/* Service-specific fields */}
                {isService && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <CustomFormField
                        control={form.control}
                        name="quantity"
                        label="Available Slots"
                        fieldType={FormFieldType.NUMBER}
                        placeholder="Number of available slots"
                        isEditable
                      />
                      <CustomFormField
                        control={form.control}
                        name="pricing_model"
                        label="Pricing Model"
                        fieldType={FormFieldType.SELECT}
                        options={[
                          { label: "Fixed", value: "fixed" },
                          { label: "Hourly", value: "hourly" },
                        ]}
                        isEditable
                      />
                      <CustomFormField
                        control={form.control}
                        name="delivery_method"
                        label="Delivery Method"
                        fieldType={FormFieldType.SELECT}
                        options={[
                          { label: "Online", value: "online" },
                          { label: "Offline", value: "offline" },
                        ]}
                        isEditable
                      />
                    </div>
                    <CustomFormField
                      control={form.control}
                      name="estimated_delivery_time"
                      label="Estimated Delivery Time *"
                      fieldType={FormFieldType.INPUT}
                      placeholder="e.g., 2 days or range of 1 - 30 days"
                      isEditable
                    />
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Available Days
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <label
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              value={day}
                              checked={
                                form.watch("available_days")?.includes(day) ||
                                false
                              }
                              onChange={(e) => {
                                const currentDays =
                                  form.getValues("available_days") || [];
                                const updatedDays = e.target.checked
                                  ? [...currentDays, day]
                                  : currentDays.filter(
                                      (d: string) => d !== day
                                    );
                                form.setValue("available_days", updatedDays);
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Available From
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const time24 = e.target.value;
                            if (time24) {
                              // Convert 24h format (HH:MM) to h:ia format
                              const [hours, minutes] = time24.split(":");
                              const hour24 = parseInt(hours);
                              const hour12 =
                                hour24 === 0
                                  ? 12
                                  : hour24 > 12
                                    ? hour24 - 12
                                    : hour24;
                              const ampm = hour24 >= 12 ? "pm" : "am";
                              const time12 = `${hour12}:${minutes}${ampm}`;
                              form.setValue("available_from", time12);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Will be saved as:{" "}
                          {form.watch("available_from") || "h:MMam/pm format"}
                        </p>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Available To
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const time24 = e.target.value;
                            if (time24) {
                              // Convert 24h format (HH:MM) to h:ia format
                              const [hours, minutes] = time24.split(":");
                              const hour24 = parseInt(hours);
                              const hour12 =
                                hour24 === 0
                                  ? 12
                                  : hour24 > 12
                                    ? hour24 - 12
                                    : hour24;
                              const ampm = hour24 >= 12 ? "pm" : "am";
                              const time12 = `${hour12}:${minutes}${ampm}`;
                              form.setValue("available_to", time12);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Will be saved as:{" "}
                          {form.watch("available_to") || "h:MMam/pm format"}
                        </p>
                      </div>
                    </div>
                  </>
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
