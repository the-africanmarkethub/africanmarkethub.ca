"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCreateProduct, type ApiVariation } from "@/hooks/useCreateProduct";
import { useAdminColors } from "@/hooks/useAdminColors";
import { useAdminSizes } from "@/hooks/useAdminSizes";
import { useVendorShops } from "@/hooks/useVendorShops";
import {
  useProductCategories,
  useServiceCategories,
} from "@/hooks/useCategories";
import SimpleTextEditor from "@/components/SimpleTextEditor";

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: colorsData } = useAdminColors();
  const { data: sizesData } = useAdminSizes();
  const { data: shopsData } = useVendorShops();

  const shopType = shopsData?.shops?.[0]?.type || "products";
  const isService = shopType === "services";

  const { data: productCategories } = useProductCategories();
  const { data: serviceCategories } = useServiceCategories();
  const categoriesData = isService ? serviceCategories : productCategories;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    category_id: "",
    sales_price: "",
    regular_price: "",
    quantity: "",
    weight: "",
    height: "",
    length: "",
    width: "",
    weight_unit: "kg" as const,
    size_unit: "cm" as const,
    notify_user: true,
  });

  // Category selection state
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [enableVariations, setEnableVariations] = useState(false);
  const [variations, setVariations] = useState<ApiVariation[]>([
    { color_id: "", size_id: "", price: "", quantity: "" },
  ]);

  // Service-specific state
  const [serviceData, setServiceData] = useState({
    pricing_model: "fixed",
    delivery_method: "online",
    estimated_delivery_time: "",
    available_days: [] as string[],
    available_from: "",
    available_to: "",
  });

  // Get subcategories for selected parent category
  const getSubcategories = () => {
    if (!selectedParentCategory || !categoriesData?.categories) return [];

    const parentCategory = categoriesData.categories.find(
      (cat) => cat.id.toString() === selectedParentCategory
    );

    return parentCategory?.children || [];
  };

  // Handle parent category change
  const handleParentCategoryChange = (categoryId: string) => {
    setSelectedParentCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when parent changes

    // Set the category_id in formData
    // If no subcategory is selected, use parent category
    setFormData({ ...formData, category_id: categoryId });
  };

  // Handle subcategory change
  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);

    // If subcategory is selected, use it; otherwise use parent category
    const finalCategoryId = subCategoryId || selectedParentCategory;
    setFormData({ ...formData, category_id: finalCategoryId });
  };

  const subcategories = getSubcategories();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size (max 2MB)
    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} exceeds 2MB limit`);
        return false;
      }
      return true;
    });

    // Add new images
    setImages((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      { color_id: "", size_id: "", price: "", quantity: "" },
    ]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (
    index: number,
    field: keyof ApiVariation,
    value: string
  ) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category_id) {
      alert("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    // Validate variations if enabled (only for products)
    if (!isService && enableVariations) {
      const validVariations = variations.filter(
        (v) => v.color_id && v.size_id && v.price && v.quantity
      );
      if (validVariations.length === 0) {
        alert("Please add at least one valid variation");
        return;
      }
    } else if (!formData.sales_price || !formData.regular_price) {
      alert("Please enter price information");
      return;
    }

    // Quantity is required for both products and services when not using variations
    if (!enableVariations && !formData.quantity) {
      alert("Please enter quantity");
      return;
    }

    // Helper function to convert 24-hour time to 12-hour with lowercase am/pm
    const convertTo12Hour = (time24: string) => {
      if (!time24) return "";
      const [hours, minutes] = time24.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "pm" : "am";
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${ampm}`;
    };

    // Prepare submission data
    const submitData = {
      ...formData,
      images,
      variations: enableVariations
        ? variations.filter(
            (v) => v.color_id && v.size_id && v.price && v.quantity
          )
        : undefined,
      ...(isService && {
        ...serviceData,
        // Convert time to 12-hour format with lowercase am/pm
        available_from: convertTo12Hour(serviceData.available_from),
        available_to: convertTo12Hour(serviceData.available_to),
      }),
    };

    createProduct(submitData, {
      onSuccess: () => {
        router.push("/vendor/products");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/vendor/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New {isService ? "Service" : "Product"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isService ? "Service" : "Product"} Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  placeholder={`Enter ${
                    isService ? "service" : "product"
                  } name`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <SimpleTextEditor
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    placeholder="Enter product description..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <SimpleTextEditor
                    value={formData.features}
                    onChange={(value) =>
                      setFormData({ ...formData, features: value })
                    }
                    placeholder="List key features..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={selectedParentCategory}
                    onChange={(e) => handleParentCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categoriesData?.categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show subcategory dropdown only if parent category has subcategories */}
                {subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory (Optional)
                    </label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => handleSubCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    >
                      <option value="">Select a subcategory (optional)</option>
                      {subcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden"
                >
                  <Image
                    src={preview}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {imagePreviews.length === 0 ? "Image" : "Add"}
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Images need to be 600x600 and 2000x2000 pixels. White backgrounds
              are recommended. Maximum image size 2Mb
            </p>
          </div>

          {/* Pricing & Inventory Section for Services (no variations) */}
          {isService && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price *
                  </label>
                  <input
                    type="number"
                    value={formData.regular_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        regular_price: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Price
                  </label>
                  <input
                    type="number"
                    value={formData.sales_price}
                    onChange={(e) =>
                      setFormData({ ...formData, sales_price: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Variations - Only show for products, not services */}
          {!isService && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableVariations}
                    onChange={(e) => setEnableVariations(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      enableVariations ? "bg-[#F28C0D]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                        enableVariations ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Enable Product Variations
                  </span>
                </label>
              </div>

              {enableVariations ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">
                      {isService ? "Service" : "Product"} Variations
                    </h3>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Variation
                    </button>
                  </div>

                  {variations.map((variation, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 items-end"
                    >
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Color
                        </label>
                        <select
                          value={variation.color_id}
                          onChange={(e) =>
                            updateVariation(index, "color_id", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent text-sm"
                        >
                          <option value="">Select color</option>
                          {colorsData?.data?.map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Size
                        </label>
                        <select
                          value={variation.size_id}
                          onChange={(e) =>
                            updateVariation(index, "size_id", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent text-sm"
                        >
                          <option value="">Select size</option>
                          {sizesData?.data?.map((size) => (
                            <option key={size.id} value={size.id}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          value={variation.price}
                          onChange={(e) =>
                            updateVariation(index, "price", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={variation.quantity}
                          onChange={(e) =>
                            updateVariation(index, "quantity", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent text-sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        disabled={variations.length === 1}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 ${
                    isService ? "md:grid-cols-2" : "md:grid-cols-3"
                  } gap-4`}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Price *
                    </label>
                    <input
                      type="number"
                      value={formData.regular_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regular_price: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sales Price *
                    </label>
                    <input
                      type="number"
                      value={formData.sales_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sales_price: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    />
                  </div>

                  {!isService && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Product Dimensions */}
          {!isService && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Dimensions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight Unit
                  </label>
                  <select
                    value={formData.weight_unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight_unit: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="oz">Ounces (oz)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length
                  </label>
                  <input
                    type="number"
                    value={formData.length}
                    onChange={(e) =>
                      setFormData({ ...formData, length: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size Unit
                  </label>
                  <select
                    value={formData.size_unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        size_unit: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  >
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Service-specific fields */}
          {isService && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Service Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={serviceData.pricing_model}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        pricing_model: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    {/* <option value="custom">Custom Quote</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method
                  </label>
                  <select
                    value={serviceData.delivery_method}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        delivery_method: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">On-site</option>
                    {/* <option value="both">Both</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="text"
                    value={serviceData.estimated_delivery_time}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        estimated_delivery_time: e.target.value,
                      })
                    }
                    placeholder="e.g., 2-3 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={serviceData.available_days.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServiceData({
                                ...serviceData,
                                available_days: [
                                  ...serviceData.available_days,
                                  day,
                                ],
                              });
                            } else {
                              setServiceData({
                                ...serviceData,
                                available_days:
                                  serviceData.available_days.filter(
                                    (d) => d !== day
                                  ),
                              });
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-[#F28C0D] focus:ring-[#F28C0D]"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From
                  </label>
                  <input
                    type="time"
                    value={serviceData.available_from}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        available_from: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available To
                  </label>
                  <input
                    type="time"
                    value={serviceData.available_to}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        available_to: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 bg-[#F28C0D] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Save & Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
