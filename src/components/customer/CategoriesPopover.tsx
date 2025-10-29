"use client";
import React, { useState } from "react";
import { Category } from "@/types/customer/category.types";
import { AlignJustify, ChevronRight, Package, Briefcase } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import useCategories from "@/hooks/customer/useCategories";

export default function CategoriesPopover() {
  const [selectedType, setSelectedType] = useState<
    "products" | "services" | null
  >(null);
  const [activeParent, setActiveParent] = useState<Category | null>(null);

  const { data: categories } = useCategories(selectedType || "products");

  // Filter for parent categories
  const parentCategories = categories?.filter((cat) => cat.parent_id === null);

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-[54px] rounded-none items-center bg-[#9C5432] font-normal text-sm gap-4 text-white">
          <AlignJustify size={22} /> All Category
        </NavigationMenuTrigger>

        <NavigationMenuContent className="bg-white border border-gray-200 shadow-lg">
          <div className="flex w-[600px] p-4 bg-white rounded-md">
            {!selectedType ? (
              // Show Products and Services options first
              <div className="w-full">
                <h3 className="font-semibold text-lg mb-4">
                  Select Category Type
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedType("products")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-8 w-8 text-[#9C5432]" />
                    <div className="text-left">
                      <p className="font-semibold">Products</p>
                      <p className="text-sm text-gray-500">
                        Browse product categories
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedType("services")}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="h-8 w-8 text-[#9C5432]" />
                    <div className="text-left">
                      <p className="font-semibold">Services</p>
                      <p className="text-sm text-gray-500">
                        Browse service categories
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Parent Categories */}
                <div className="w-1/2 border-r pr-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {selectedType === "products" ? "Product" : "Service"}{" "}
                      Categories
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedType(null);
                        setActiveParent(null);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Back
                    </button>
                  </div>
                  {parentCategories?.map((parent) => (
                    <div
                      key={parent.id}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onMouseEnter={() => setActiveParent(parent)}
                    >
                      <span>{parent.name}</span>
                      {parent.children && parent.children.length > 0 && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Child Categories */}
                <div className="w-1/2 pl-4">
                  {activeParent ? (
                    <>
                      <h3 className="font-semibold text-lg mb-2">
                        {activeParent.name}
                      </h3>
                      {activeParent.children &&
                      activeParent.children.length > 0 ? (
                        activeParent.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/customer/products/category/${
                              child.id
                            }?name=${encodeURIComponent(child.name)}`}
                            className="block p-2 rounded-lg hover:bg-gray-100"
                          >
                            {child.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm p-2">
                          No sub-categories
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        Hover over a category to see sub-categories
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
