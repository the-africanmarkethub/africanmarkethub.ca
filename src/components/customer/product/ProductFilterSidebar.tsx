"use client";
import { Search } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useCategories from "@/hooks/customer/useCategories";
import { useSizes } from "@/hooks/customer/useSizes";
import { Category } from "@/types/customer/category.types";
import { Size } from "@/types/customer/product.types";

interface FilterState {
  min_price?: number;
  max_price?: number;
  category_id?: number;
  size_id?: number;
  rating?: number;
  availability?: string;
  location?: string;
}

interface ProductFilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
}


export default function ProductFilterSidebar({ onFiltersChange }: ProductFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([10, 100]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [location, setLocation] = useState("");
  
  // Fetch real data
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories("products");
  const { data: sizesData, isLoading: sizesLoading } = useSizes();
  
  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const sizes = useMemo(() => sizesData?.data || [], [sizesData?.data]);

  // Emit filter changes whenever any filter state changes
  useEffect(() => {
    const filters: FilterState = {};
    
    if (priceRange[0] > 10) filters.min_price = priceRange[0];
    if (priceRange[1] < 100) filters.max_price = priceRange[1];
    if (selectedCategory) {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) filters.category_id = category.id;
    }
    if (selectedSize) filters.size_id = selectedSize;
    if (selectedRating) filters.rating = parseFloat(selectedRating);
    if (selectedAvailability) filters.availability = selectedAvailability;
    if (location.trim()) filters.location = location.trim();
    
    onFiltersChange?.(filters);
  }, [priceRange, selectedCategory, selectedSize, selectedRating, selectedAvailability, location, categories, onFiltersChange]);

  return (
    <aside className="w-[280px] min-w-[280px] bg-gray-50 rounded-2xl p-6 self-start">
      {/* <h3 className="text-lg font-semibold mb-6">Filters</h3> */}

      {/* Price Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Price</h4>
        <Slider
          defaultValue={priceRange}
          max={200}
          step={1}
          onValueChange={(value: number[]) => setPriceRange(value)}
          className="mb-4"
        />
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={`$${priceRange[0]}`}
            readOnly
            className="w-20 text-center bg-white border border-gray-200 rounded-md py-1"
          />
          <span>-</span>
          <input
            type="text"
            value={`$${priceRange[1]}`}
            readOnly
            className="w-20 text-center bg-white border border-gray-200 rounded-md py-1"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Categories</h4>
        {categoriesLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="space-y-3"
          >
            {categories.map((category: Category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.name} id={category.name} />
                <Label
                  htmlFor={category.name}
                  className="font-normal flex justify-between w-full cursor-pointer"
                >
                  <span>{category.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Location</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
          />
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Size</h4>
        {sizesLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-10 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: Size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(selectedSize === size.id ? null : size.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  selectedSize === size.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Rating</h4>
        <RadioGroup
          value={selectedRating}
          onValueChange={setSelectedRating}
          className="space-y-3"
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem value={`${rating}.0`} id={`rating-${rating}`} />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 font-normal"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < rating ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="font-semibold mb-4">Availability</h4>
        <RadioGroup
          value={selectedAvailability}
          onValueChange={setSelectedAvailability}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_stock" id="in-stock" />
            <Label htmlFor="in-stock" className="font-normal">
              In Stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fast_delivery" id="fast-delivery" />
            <Label htmlFor="fast-delivery" className="font-normal">
              Fast Delivery
            </Label>
          </div>
        </RadioGroup>
      </div>
    </aside>
  );
}
