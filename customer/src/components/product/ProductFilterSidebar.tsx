"use client";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Mock data based on the design
const categories = [
  { name: "Dresses", count: 134 },
  { name: "Tops", count: 150 },
  { name: "Active wear", count: 54 },
  { name: "Foot wear", count: 47 },
  { name: "Swim wear", count: 43 },
  { name: "Outer wear", count: 38 },
  { name: "House wear", count: 15 },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductFilterSidebar() {
  const [priceRange, setPriceRange] = useState([10, 100]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedRating, setSelectedRating] = useState("4.0");
  const [selectedAvailability, setSelectedAvailability] =
    useState("fast-delivery");

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
        <RadioGroup defaultValue={categories[1].name} className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <RadioGroupItem value={category.name} id={category.name} />
              <Label
                htmlFor={category.name}
                className="font-normal flex justify-between w-full"
              >
                <span>{category.name}</span>
                <span className="text-gray-500">({category.count})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Location Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Location</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
          />
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                selectedSize === size
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
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
            <RadioGroupItem value="in-stock" id="in-stock" />
            <Label htmlFor="in-stock" className="font-normal">
              In Stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fast-delivery" id="fast-delivery" />
            <Label htmlFor="fast-delivery" className="font-normal">
              Fast Delivery
            </Label>
          </div>
        </RadioGroup>
      </div>
    </aside>
  );
}
