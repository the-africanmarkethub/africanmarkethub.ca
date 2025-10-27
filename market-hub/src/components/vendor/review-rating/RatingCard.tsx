import { Card, CardContent } from "@/components/vendor/ui/card";
import { CustomProgress } from "../CustomProgress";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingCategory {
  name: string;
  rating: number;
}

interface RatingCardProps {
  overallRating: number;
  totalReviews: number;
  categories?: RatingCategory[];
  categoryRating?: boolean;
}

export function RatingCard({
  overallRating,
  totalReviews,
  categories,
  categoryRating = true,
}: RatingCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        stroke="none"
        className={`w-6 h-6 ${
          index < Math.floor(rating)
            ? "fill-[#F1BB13] text-[#F1BB13"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const getProgressValue = (rating: number) => {
    return (rating / 5) * 100;
  };

  return (
    <Card className="w-full bg-white border border-[#DCDCDC] rounded-2xl">
      <CardContent className="p-4">
        <div
          className={cn(
            "grid grid-cols-2 gap-8",
            !categoryRating && "grid-cols-1"
          )}
        >
          {/* Left Side - Overall Rating */}
          <div className="w-full min-h-[422px] flex flex-col items-center justify-center bg-[#F8F8F8] rounded-2xl">
            <div className="text-[63px] leading-[73px] font-semibold">
              {overallRating.toFixed(1)}
            </div>

            <div className="flex space-x-1 pt-6 pb-[22px]">
              {renderStars(overallRating)}
            </div>

            <div className="text-sm text-[#464646] font-normal">
              {totalReviews} Reviews
            </div>
          </div>

          {/* Right Side - Category Ratings */}
          {categoryRating && (
            <div className="space-y-[36px]">
              {categories?.map((category, index) => (
                <div key={index} className="space-y-2.5">
                  <div className="flex justify-between items-center font-normal text-sm text-[#292929]">
                    <span className="">{category.name}</span>
                    <span className="font-medium">
                      {category.rating.toFixed(1)}
                    </span>
                  </div>
                  <CustomProgress
                    value={getProgressValue(category.rating)}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
