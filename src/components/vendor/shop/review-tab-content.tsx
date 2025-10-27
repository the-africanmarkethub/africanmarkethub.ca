import AnalyticsStatsCard from "../analytics/analytics-stats-card";
import CustomDonutChart from "../CustomDonutChart";
import { RatingCard } from "../review-rating/RatingCard";
import ReviewStatistics from "../review-rating/review-statistics";
import ProductReviews from "./product-reviews";

const mockData = {
  totalReviews: {
    value: "127",
    percentage: 6.7,
    increase: true,
  },
  averageRating: {
    value: "9.73%",
    percentage: 4.5,
    increase: true,
  },
  responseRate: {
    value: "81.94%",
    percentage: 2.4,
    increase: true,
  },
  ratings: {
    overallRating: 4.8,
    totalReviews: 200,
  },
  sentiment: [
    { name: "Positive", value: 20, color: "#165DFF" },
    { name: "Neutral", value: 40, color: "#FFC700" },
    { name: "Negative", value: 40, color: "#E84646" },
  ],
};

export default function ReviewTabContent() {
  return (
    <div className="space-y-8 xl:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
        <AnalyticsStatsCard
          title="Total Reviews"
          value={mockData.totalReviews.value}
          percentage={mockData.totalReviews.percentage}
          increase={mockData.totalReviews.increase}
          icon="/assets/icons/message-square.svg"
        />
        <AnalyticsStatsCard
          title="Average Rating"
          value={mockData.averageRating.value}
          percentage={mockData.averageRating.percentage}
          increase={mockData.averageRating.increase}
          icon="/assets/icons/star.svg"
        />
        <AnalyticsStatsCard
          title="Response Rate"
          value={mockData.responseRate.value}
          percentage={mockData.responseRate.percentage}
          increase={mockData.responseRate.increase}
          icon="/assets/icons/trending-down.svg"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <RatingCard
          overallRating={mockData.ratings.overallRating}
          totalReviews={mockData.ratings.totalReviews}
          categoryRating={false}
        />
        <CustomDonutChart
          title="Sentiment"
          total={1000}
          data={mockData.sentiment}
          chartDirection="row"
          legendDirection="column"
        />
      </div>

      <ReviewStatistics />
      <ProductReviews />
    </div>
  );
}
