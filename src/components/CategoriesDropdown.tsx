"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductCategories, useServiceCategories } from "@/hooks/useCategories";

interface Category {
  id: number;
  name: string;
  type: "products" | "services";
  image: string;
  slug: string;
  description: string;
  children?: Category[];
}

export function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"products" | "services" | null>(null);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: productCategories } = useProductCategories();
  const { data: serviceCategories } = useServiceCategories();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedType(null);
        setSelectedParent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTypeSelect = (type: "products" | "services") => {
    setSelectedType(type);
    setSelectedParent(null);
  };

  const handleParentSelect = (category: Category) => {
    if (category.children && category.children.length > 0) {
      setSelectedParent(category);
    } else {
      // Navigate to category page if no children
      window.location.href = `/category/${category.type}/${category.id}`;
      setIsOpen(false);
    }
  };

  const handleSubcategoryClick = (subcategory: Category) => {
    window.location.href = `/category/${subcategory.type}/${subcategory.id}`;
    setIsOpen(false);
  };

  const getCurrentCategories = () => {
    if (selectedType === "products") {
      return productCategories?.categories || [];
    } else if (selectedType === "services") {
      return serviceCategories?.categories || [];
    }
    return [];
  };

  const parentCategories = getCurrentCategories().filter(cat => !cat.parent_id);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-black hover:bg-opacity-10 px-2 md:px-3 py-2 rounded transition-colors text-white"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="text-sm md:text-base">All Category</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {!selectedType ? (
            // Main menu - Products vs Services
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleTypeSelect("products")}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Products</p>
                    <p className="text-sm text-gray-600">Physical items and goods</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => handleTypeSelect("services")}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Services</p>
                    <p className="text-sm text-gray-600">Professional services</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : !selectedParent ? (
            // Parent categories list
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{selectedType}</h3>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {parentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleParentSelect(category)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600 truncate">{category.description}</p>
                    </div>
                    {category.children && category.children.length > 0 && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Subcategories list
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setSelectedParent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">{selectedParent.name}</h3>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedParent.children?.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={subcategory.image}
                        alt={subcategory.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{subcategory.name}</p>
                      <p className="text-sm text-gray-600 truncate">{subcategory.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}