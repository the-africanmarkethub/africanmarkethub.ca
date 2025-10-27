"use client";

import { Product } from "@/types/customer/product.types";
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
            <div className="text-gray-600 leading-[22px] prose max-w-none">
              {product?.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description available for this product.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            {product?.reviews && product.reviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {product.reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < (review.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.user_name || "Anonymous"}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {review.comment || review.review}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center py-8">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSwitcher;
