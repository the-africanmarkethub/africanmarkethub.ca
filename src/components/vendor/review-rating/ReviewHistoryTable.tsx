"use client";
import { useState } from "react";
// import TableSkeletonLoader from "@/components/TableSkeletonLoader";
// import { useGetReviews } from "@/hooks/useReview";
import { type Review } from "../dashboard/recent-review";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import Image from "next/image";
import { RatingStars } from "../RatingStars";
import { Badge } from "../ui/badge";
import { type TableReview } from "./ReviewTable";
import FilterTabs from "../ui/FilterTabs";
import { type FilterStatus } from "../ui/FilterTabs";

const recentReviews = [
  {
    id: "1",
    user: {
      name: "Sam",
      last_name: "Altmangon",
      profile_photo:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI0Q1REVFRiIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjcyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlNBPC90ZXh0Pgo8L3N2Zz4=",
    },
    rating: 4,
    product: {
      title: "adidas",
      image: "/assets/images/photo_product.png",
    },
    comment: "This is awesome. I will buy more and more from this vendor.",
    created_at: "2025-03-26T11:53:51.000000Z",
    status: "Published" as const,
  },
  {
    id: "2",
    user: {
      name: "Sam",
      last_name: "Joshua",
      profile_photo:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI0Q1REVFRiIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjcyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPlNBPC90ZXh0Pgo8L3N2Zz4=",
    },
    rating: 3,
    product: {
      title: "adidas",
      image: "/assets/images/photo_product.png",
    },
    comment: "This is awesome. I will buy more and more from this vendor.",
    created_at: "2025-03-26T11:53:51.000000Z",
    status: "Deleted" as const,
  },
];

const ReviewHistoryTable = () => {
  // const { data: reviewResponse, isLoading } = useGetReviews();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

  const reviews: TableReview[] =
    // dummy data
    recentReviews?.map((review: Review) => {
      return {
        id: review.id,
        customer:
          (review.user.name || "") + " " + (review.user.last_name || ""),
        avatar:
          review.user?.profile_photo || "/assets/images/fallback-avatar.svg",
        productName: review.product.title || "",
        productImage: review.product.image || "",
        review: review.comment || "",
        rating: review.rating,
        date: new Date(review.created_at).toLocaleDateString(),
        status: review.status,
      };
    }) || [];

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === "All") return true;
    return review.status === activeFilter;
  });

  const filterTabs: FilterStatus[] = ["All", "Published", "Deleted"];

  const columns = [
    {
      header: "Customer",
      accessorKey: "customer",
      cell: (item: TableReview) => (
        <div className="flex justify-start gap-x-1" title={item.customer}>
          <Image
            src={item.avatar}
            alt={item.customer}
            width={40}
            height={40}
            className="rounded-full"
          />
          {item.customer}
        </div>
      ),
    },
    {
      header: "Products",
      accessorKey: "product",
      cell: (item: TableReview) => (
        <div className="flex justify-start gap-x-1" title={item.productName}>
          <Image
            src={item.productImage}
            alt={item.productName}
            width={40}
            height={40}
            className="rounded-md"
          />
          {item.productName}
        </div>
      ),
    },
    {
      header: "Review",
      accessorKey: "review",
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (item: TableReview) => (
        <div className="flex flex-col items-start gap-y-1.5">
          <p className="text-sm font-normal text-[#525252]">
            {item.rating} stars
          </p>
          <RatingStars rating={item.rating} width={13} height={13} />
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: TableReview) => (
        <Badge
          variant={
            item.status === "Published"
              ? "success"
              : item.status === "Deleted"
                ? "destructive"
                : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#DCDCDC] mx-auto pb-5 bg-white">
      <div className="flex justify-start pt-5 pb-6">
        <FilterTabs
          filterTabs={filterTabs}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      {/* {isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <DataTable data={reviews} columns={columns} rowActions={rowActions} />
      )} */}
      <DataTable data={filteredReviews} columns={columns} enableSelection />
    </div>
  );
};

export default ReviewHistoryTable;
