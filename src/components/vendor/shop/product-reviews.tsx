"use client";

import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Card } from "@/components/vendor/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/vendor/ui/avatar";
import { Badge } from "@/components/vendor/ui/badge";
import { Textarea } from "@/components/vendor/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  Edit,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/vendor/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/vendor/ui/popover";
import Image from "next/image";
import { type DateRange } from "../vendor-support/ticketing-table";
import { RatingStars } from "../RatingStars";

export default function ProductReviews() {
  const [expandedReviews, setExpandedReviews] = useState<number[]>([2]);
  const [responseText, setResponseText] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("all");
  // const [selectedLocation, setSelectedLocation] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the response to your backend
    console.log("Saving response:", responseText);
  };

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // parameters for filtering (to be handled later)
  // const filters = {
  //   status: selectedStatus,
  //   dateRange,
  //   location: selectedLocation,
  // };

  const filtersConfig = [
    {
      label: "Status",
      type: "status" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Close", value: "close" },
        { label: "Open", value: "Open" },
      ],
      onSelect: (value: string) => {
        // setSelectedStatus(value);
        console.log("Status filter:", value);
      },
    },
    {
      label: "Date",
      type: "dateRange" as const,
      dateRange,
      onDateRangeChange: (range: DateRange) => {
        setDateRange(range);
        console.log("Date range:", range);
      },
    },
    {
      label: "Location",
      type: "location" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Local", value: "local" },
        { label: "International", value: "international" },
      ],
      onSelect: (value: string) => {
        // setSelectedLocation(value);
        console.log("Location filter:", value);
      },
    },
  ];

  const reviews = [
    {
      id: 1,
      user: "Kristin Watson",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      isResponded: true,
      date: "14/05/24",
      text: "Nice air dried chicken treats. Delicious and nutritious.",
      images: [
        "/assets/images/product-review-image.png",
        "/assets/images/product-review-image.png",
      ],
      isHelpful: true,
      isPurchaseVerified: true,
      helpfulCount: 12,
    },
    {
      id: 2,
      user: "Kristin Watson",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      isResponded: false,
      date: "14/05/24",
      text: "Nice air dried chicken treats. Delicious and nutritious.",
      images: [
        "/assets/images/product-review-image.png",
        "/assets/images/product-review-image.png",
      ],
      isHelpful: true,
      isPurchaseVerified: true,
      helpfulCount: 8,
      hasExtendedInfo: true,
      postedDate: "Dec 5, 23",
    },
    {
      id: 3,
      user: "Kristin Watson",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      isResponded: false,
      date: "14/05/24",
      text: "Nice air dried chicken treats. Delicious and nutritious.",
      images: [
        "/assets/images/product-review-image.png",
        "/assets/images/product-review-image.png",
      ],
      isHelpful: true,
      isPurchaseVerified: true,
      helpfulCount: 15,
    },
    {
      id: 4,
      user: "Kristin Watson",
      avatar: "/assets/images/avatar.png",
      rating: 5,
      isResponded: true,
      date: "14/05/24",
      text: "Nice air dried chicken treats. Delicious and nutritious.",
      images: [
        "/assets/images/product-review-image.png",
        "/assets/images/product-review-image.png",
      ],
      isHelpful: true,
      isPurchaseVerified: true,
      helpfulCount: 7,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-[16px] md:p-8">
      {/* Header */}
      <div className="flex flex-col items-start gap-6 justify-between mb-6 md:flex-row md:items-center">
        <h1 className="text-lg/6 text-[#1D2129] font-medium md:text-2xl">
          Product Reviews
        </h1>
        {filtersConfig.length > 0 && (
          <div className="flex items-center flex-wrap gap-3 md:flex-nowrap">
            {filtersConfig.map((filter, index) =>
              filter.type === "dateRange" ? (
                <Popover key={index}>
                  <PopoverTrigger
                    asChild
                    className="bg-white border border-[#EEEEEE] rounded-sm"
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {filter.label}
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex bg-[#FFFFFF] gap-2 p-3">
                      <div>
                        <div className="mb-2 font-medium">Start Date</div>
                        <CalendarComponent
                          mode="single"
                          selected={filter.dateRange?.from}
                          onSelect={(date) =>
                            filter.onDateRangeChange?.({
                              from: date || undefined,
                              to: filter.dateRange?.to,
                            })
                          }
                          initialFocus
                        />
                      </div>
                      <div>
                        <div className="mb-2 font-medium">End Date</div>
                        <CalendarComponent
                          mode="single"
                          selected={filter.dateRange?.to}
                          onSelect={(date) =>
                            filter.onDateRangeChange?.({
                              from: filter.dateRange?.from,
                              to: date || undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Select key={index} onValueChange={filter.onSelect}>
                  <SelectTrigger className="w-[126px] rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] font-medium text-xs">
                    {filter.type === "status" ? (
                      <Filter className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FFFFFF]">
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-0 shadow-none">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.avatar} alt={review.user} />
                  <AvatarFallback>
                    {review.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-x-2">
                    <span className="font-medium text-gray-900">
                      {review.user}
                    </span>
                    {review.isResponded && (
                      <Badge
                        variant={review.isResponded ? "success" : "destructive"}
                        className="py-1 px-2"
                      >
                        Responded
                      </Badge>
                    )}
                  </div>
                  <RatingStars rating={5} width={16} height={16} />
                  <p className="font-normal text-xs text-[#989898] mt-1">
                    {review.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {review.isHelpful && (
                  <span className="text-sm hidden text-[#656565] md:block">
                    Helpful
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3.5">
              <p className="font-normal text-sm text-[#656565]">
                {review.text}
              </p>
              <span className="hidden text-[#292929] text-sm font-medium md:block">
                {review.helpfulCount}
              </span>
            </div>

            <div className="flex justify-between mb-3.5 md:hidden">
              {review.isHelpful && (
                <span className="text-sm text-[#656565]">Helpful</span>
              )}
              <span className="text-[#292929] text-sm font-medium">
                {review.helpfulCount}
              </span>
            </div>

            {/* Product Images */}
            <div className="flex justify-between items-end pb-4 border-b">
              <div className="flex gap-3">
                {review.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-[8px] md:w-20 md:h-20"
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(review.id)}
                className="text-[#464646] hover:text-[#464646] p-1"
              >
                {expandedReviews.includes(review.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Expanded Content */}
            {expandedReviews.includes(review.id) && (
              <Card className="px-3 py-4 bg-[#F8F8F8] rounded-[16px] mt-4 border-0">
                {/* Mark as helpful section */}
                <div className="">
                  <Button
                    className="flex items-center font-normal text-xs text-[#009900] hover:text-[#009900] gap-x-2 p-0 md:text-sm"
                    variant="ghost"
                  >
                    <CheckCircle className="h-[22px] w-[22px]" />
                    Mark as helpful
                  </Button>
                  <h2 className="text-xs font-normal text-gray-900 mb-2 mt-1 md:text-sm">
                    Your Response
                  </h2>
                </div>

                {/* Response content */}
                {!isEditing && review.isResponded ? (
                  <div className="text-[#292929] font-normal text-sm px-4 py-3 bg-white rounded-[16px] border border-[#EEEEEE] md:text-base md:leading-[22px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-normal text-[#656565]">
                        Posted on 2024-23-07
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEdit}
                        className="text-xs text-[#F28C0D] hover:text-[#F28C0D] font-medium p-0 md:text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                    {responseText}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response"
                      className="text-[16px] leading-[22px] text-[#656565] min-h-[137px] resize-none px-4 py-3 bg-white border-[#EEEEEE] rounded-[16px]"
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-[#F28C0D] hover:bg-[#F28C0D] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors md:px-6 md:py-3"
                        size="lg"
                        onClick={handleSave}
                      >
                        Post Response
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
