"use client";

import { Product } from "@/types/product.types";
import { useState } from "react";

// Define proper props interface
interface TabSwitcherProps {
  product: Product;
}

const TabSwitcher = ({ product }: TabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  return (
    <div className="w-full">
      <div className=" border-b border-gray-300">
        <div className="flex justify-center  space-x-8">
          {(["description", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-base font-medium relative ${
                activeTab === tab ? "text-black" : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              {activeTab === tab && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "description" ? (
          <div className="flex items-center flex-col gap-4 ">
            <h2 className="text-xl font-semibold">{product?.title}</h2>
            <p className="text-gray-600 leading-[22px]">
              {product?.description}
            </p>
          </div>
        ) : (
          <div className="">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <p className="text-gray-600 mt-2">
              ⭐⭐⭐⭐⭐ Amazing product! I highly recommend it. <br />
              ⭐⭐⭐⭐ Very good quality, but the shipping took a bit long.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSwitcher;
