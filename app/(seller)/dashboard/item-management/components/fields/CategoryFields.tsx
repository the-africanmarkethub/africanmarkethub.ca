"use client";
import SelectDropdown from "@/app/(seller)/dashboard/components/commons/Fields/SelectDropdown";
import { useState, KeyboardEvent } from "react";
import { FaTimes } from "react-icons/fa";

export default function CategoryFields(props: any) {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedChildCategory,
    setSelectedChildCategory,
    keywords = [],
    setKeywords,
  } = props;

  const [inputValue, setInputValue] = useState("");

  // Check if it's Transportation & Logistics

  // Logic to add keyword
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();

      // Add only if not empty and not duplicate
      if (trimmed && !keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
        setInputValue("");
      }
    }
  };

  // Logic to remove keyword
  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_:any, index:any) => index !== indexToRemove));
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <SelectDropdown
          options={categories}
          value={selectedCategory}
          onChange={(v: any) => setSelectedCategory(v)}
          placeholder="Select category"
        />
      </div>

      {categories &&
        (selectedCategory?.children?.length > 0 ? (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory <span className="text-hub-primary">(required)</span>
            </label>
            <SelectDropdown
              options={selectedCategory.children}
              value={selectedChildCategory}
              onChange={(v: any) => setSelectedChildCategory(v)}
              placeholder="Select subcategory"
            />
          </div>
        ) : selectedCategory?.value ? (
          <p className="mt-2 text-xs text-gray-500 italic">
            No subcategories available
          </p>
        ) : null)}

      {/* NEW: Keywords Field - Hidden if Logistics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Keywords <span className="text-red-500">*</span>
            <span className="text-gray-400 text-xs">
              (Press Enter or Comma to add)
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2 input">
            {keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-hub-secondary"
              >
                {keyword}
                <button
                  type="button"
                  aria-label="remove"
                  onClick={() => removeKeyword(index)}
                  className="ml-1.5 cursor-pointer inline-flex items-center justify-center text-hub-primary hover:text-hub-secondary focus:outline-none"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none bg-transparent min-w-35 text-sm text-gray-700 placeholder-gray-400"
              placeholder={
                keywords.length === 0 ? "e.g., Authentic, Organic, Food" : ""
              }
            />
          </div>
        </div>
    </>
  );
}
