"use client";
import { useState } from "react";
import { OverviewChart } from "@/components/vendor/dashboard/OverviewChart";
import { PageHeader } from "@/components/vendor/page-header";
import { RatingCard } from "@/components/vendor/review-rating/RatingCard";
import ReviewTable from "@/components/vendor/review-rating/ReviewTable";

const sampleData = {
  overallRating: 4.8,
  totalReviews: 200,
  categories: [
    { name: "Top Quality", rating: 4.5 },
    { name: "Fast Delivery", rating: 4.5 },
    { name: "Accurate Order", rating: 4.5 },
    { name: "Great Service", rating: 4.9 },
    { name: "Perfect Packaging", rating: 4.5 },
    { name: "Smooth Experience", rating: 4.5 },
  ],
};

const salesData = [
  { date: "2025-01-11", total: "13500" },
  { date: "2025-02-11", total: "5200" },
  { date: "2025-03-11", total: "10800" },
  { date: "2025-04-11", total: "8900" },
  { date: "2025-05-11", total: "7200" },
  { date: "2025-06-11", total: "26800" },
  { date: "2025-07-11", total: "11200" },
  { date: "2025-08-11", total: "8500" },
  { date: "2025-09-11", total: "29800" },
  { date: "2025-10-11", total: "12100" },
  { date: "2025-11-11", total: "64366" },
  { date: "2025-12-11", total: "15200" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RatingReviewPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  return (
    <div className="p-8 space-y-8 xl:p-8 xl:space-y-8">
      <PageHeader title="Rating & Review" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 xl:grid-cols-2">
        <RatingCard
          overallRating={sampleData.overallRating}
          totalReviews={sampleData.totalReviews}
          categories={sampleData.categories}
        />
        <OverviewChart
          title="Review Statistics"
          data={salesData}
          options={months}
          selectedOption={selectedMonth}
          setSelectedOption={setSelectedMonth}
        />
      </div>
      <ReviewTable />
    </div>
  );
}
