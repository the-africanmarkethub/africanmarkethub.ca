"use client";

import { useState, useRef, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import parse from "html-react-parser";
import ProductGrid from "./ProductGrid";
import EmptyItem from "./EmptyItem";
import { formatHumanReadableDate } from "@/utils/formatDate";
import Item from "@/interfaces/items";

interface ReviewUser {
  id: number;
  name: string;
  last_name?: string;
  profile_photo: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Review {
  id: number;
  product_id: number;
  order_id: number;
  user_id: number;
  comment: string;
  images: string[];
  image_public_ids: string[];
  rating: number;
  created_at: string;
  updated_at: string;
  user: ReviewUser;
}

export interface StarRatingLevel {
  id: number;
  rating: number; // 1-5
  comment: string;
  user: { name: string; profile_photo: string };
}

export interface StarRating {
  total: number;
  reviews: StarRatingLevel[];
}

interface ItemTabsProps {
  description: string;
  reviews: Review[];
  star_rating: StarRating;
  recommended: Item[];
  frequentlyBoughtTogether: Item[];
}

export default function ItemTabs({
  description,
  reviews,
  star_rating,
  recommended,
  frequentlyBoughtTogether,
}: ItemTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  // Compute rating distribution
  const ratingPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = star_rating.reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percentage: star_rating.total ? (count / star_rating.total) * 100 : 0,
    };
  });

  const [showAllReviews, setShowAllReviews] = useState(false);

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [canToggleDescription, setCanToggleDescription] = useState(false);

  useEffect(() => {
    if (!descriptionRef.current) return;

    const el = descriptionRef.current;

    const isOverflowing = el.scrollHeight > el.clientHeight;
    setCanToggleDescription(isOverflowing);
  }, [description]);

  return (
    <div className="bg-gray-50">
      {/* ------------------- TABS ------------------- */}
      <div className="flex justify-center border-b border-gray-300">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "description"
              ? "border-b-2 border-red-800 text-red-800"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "reviews"
              ? "border-b-2 border-red-800 text-red-800"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* ------------------- TAB CONTENT ------------------- */}
      <div className="mt-4 p-4 text-gray-600">
        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <div className="prose max-w-none text-gray-700">
            <div
              ref={descriptionRef}
              className={showFullDescription ? "" : "line-clamp-5"}
            >
              {parse(description)}
            </div>

            {/* Toggle Button — only when needed */}
            {canToggleDescription && (
              <button
                onClick={() => setShowFullDescription((prev) => !prev)}
                className="mt-2 text-red-800 font-medium text-sm"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Star Summary */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {star_rating.total
                    ? (
                        star_rating.reviews.reduce(
                          (sum, r) => sum + r.rating,
                          0
                        ) / star_rating.total
                      ).toFixed(1)
                    : 0}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i <
                        (star_rating.total
                          ? Math.round(
                              star_rating.reviews.reduce(
                                (sum, r) => sum + r.rating,
                                0
                              ) / star_rating.total
                            )
                          : 0)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-400">
                  ({star_rating.total} reviews)
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {ratingPercentages.map((r) => (
                  <div key={r.star} className="flex items-center gap-2">
                    <span className="text-sm">{r.star} star</span>
                    <div className="bg-gray-200 h-2 flex-1 rounded overflow-hidden">
                      <div
                        className="bg-yellow-500 h-2"
                        style={{ width: `${r.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">
                Customers who bought this item are yet to review.
              </p>
            ) : (
              <>
                {visibleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={review.user.profile_photo}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {review.user.name}
                        </p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-gray-400">
                        {formatHumanReadableDate(review.created_at)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row gap-4">
                      {/* Comment */}
                      <p className="text-gray-600 text-sm flex-1">
                        {review.comment}
                      </p>

                      {/* Review Images */}
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {review.images.map((img, idx) => (
                            <Image
                              key={idx}
                              src={img}
                              alt={`Review ${review.id} image ${idx}`}
                              width={60} // reduced size
                              height={60} // reduced size
                              className="rounded-md object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Read More Button */}
                {!showAllReviews && reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="btn btn-gray mx-auto block"
                  >
                    Read more reviews
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ------------------- RECOMMENDED / SIMILAR / MOST VIEWED ------------------- */}
      <div className="mt-6 p-4 bg-gray-100">
        <h2 className="text-xs sm:text-sm font-semibold mb-4">
          Frequently bought together
        </h2>
        {frequentlyBoughtTogether.length === 0 ? (
          <EmptyItem message="No Frequently bought together items" />
        ) : (
          <ProductGrid
            products={frequentlyBoughtTogether}
            columns="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          />
        )}

        <h2 className="text-xs sm:text-sm font-semibold mb-4 mt-8">
          Recommended for you
        </h2>
        {recommended.length === 0 ? (
          <EmptyItem message="No recommended items" />
        ) : (
          <ProductGrid
            products={recommended}
            columns="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          />
        )}
      </div>
    </div>
  );
}
