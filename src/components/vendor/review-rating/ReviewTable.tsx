import { CircleCheckBig, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/vendor/ui/button";
import { useGetReviews } from "@/hooks/vendor/useReview";
import { type Review } from "../dashboard/recent-review";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import Image from "next/image";
import { RatingStars } from "../RatingStars";

export interface TableReview {
  id: string;
  customer: string;
  avatar: string;
  productName: string;
  productImage: string;
  review: string;
  rating: number;
  date: string;
  status: "Published" | "Deleted";
}

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

const ReviewTable = () => {
  const { data: reviewResponse, isLoading } = useGetReviews();
  
  // Use real API data if available, fallback to dummy data
  const reviewsData = reviewResponse?.data || recentReviews;
  
  const reviews: TableReview[] =
    reviewsData?.map((review: Review) => {
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
          <RatingStars rating={item.rating} height={13} width={13} />
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
    },
  ];

  const rowActions = () => (
    <div className="flex flex-col items-start gap-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="flex p-0 justify-start gap-x-2 text-[#F28C0D] hover:text-[#F28C0D]"
      >
        <CircleCheckBig className="h-4 w-4" />
        Publish
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex p-0 justify-start gap-x-2 text-[#F1352B] hover:text-[#F1352B]"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );

  return (
    <div className="w-full rounded-2xl border border-[#DCDCDC] mx-auto pb-5 bg-white relative">
      <div className="flex justify-between items-center px-6 py-8">
        <h1 className="text-[24px] leading-[31.92px] font-medium text-gray-900">
          All Reviews
        </h1>
        <Link
          href="rating-review/history"
          className="text-xs font-medium border border-[#EEEEEE] rounded-sm px-4 py-2.5"
        >
          See Review History
        </Link>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      ) : (
        <DataTable
          data={reviews}
          columns={columns}
          rowActions={rowActions}
          enableSelection
        />
      )}
    </div>
  );
};

export default ReviewTable;
