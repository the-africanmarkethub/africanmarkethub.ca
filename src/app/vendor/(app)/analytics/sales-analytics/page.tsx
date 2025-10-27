"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import AnalyticsStatsCard from "@/components/vendor/analytics/analytics-stats-card";
import TopListCard from "@/components/vendor/analytics/top-list-card";
import CountryStats from "@/components/vendor/analytics/country-stats";
import SimpleOrderTable from "@/components/vendor/dashboard/simple-order-table";
import { useTopCategories } from "@/hooks/vendor/useTopCategories";
import { useTopProducts } from "@/hooks/vendor/useTopProducts";
import { useTopCustomerLocations } from "@/hooks/vendor/useTopCustomerLocations";
import { useSalesAnalytics } from "@/hooks/vendor/useSalesAnalytics";
import WorldMapEnhanced from "@/components/vendor/analytics/WorldMapEnhanced";
import {
  CategoryData,
  ProductData,
  LocationData,
  TransformedCategory,
  TransformedProduct,
} from "@/types/vendor/api";

// Import PieChart component dynamically to avoid SSR issues
const VisitedPagesPieChart = dynamic(
  () => import("@/components/vendor/analytics/VisitedPagesPieChart"),
  { ssr: false }
);

// Fallback data for user location when API data is unavailable
const fallbackUserLocation = [
  {
    id: 1,
    imgUrl: "/assets/images/usa-flag.png",
    country: "United State (USA)",
    percentage: 54,
    usersCount: 5761687,
  },
  {
    id: 2,
    imgUrl: "/assets/images/canada-flag.png",
    country: "Canada",
    percentage: 54,
    usersCount: 5761687,
  },
  {
    id: 3,
    imgUrl: "/assets/images/uk-flag.png",
    country: "United Kingdom",
    percentage: 54,
    usersCount: 5761687,
  },
];

// Helper function to get flag image based on country name
const getFlagImage = (countryName: string): string => {
  const country = countryName.toLowerCase();
  if (country.includes("usa") || country.includes("united state")) return "usa";
  if (country.includes("canada")) return "canada";
  if (country.includes("uk") || country.includes("kingdom")) return "uk";
  return "usa"; // default fallback
};

function Page() {
  const { data: topCategoriesData, isLoading: isLoadingCategories } =
    useTopCategories();
  const { data: topProductsData, isLoading: isLoadingProducts } =
    useTopProducts();
  const { data: locationsData, isLoading: isLoadingLocations } =
    useTopCustomerLocations();
  const { data: salesAnalyticsData, isLoading: isLoadingSalesAnalytics } =
    useSalesAnalytics();

  const transformedCategories =
    topCategoriesData?.data?.map((category: CategoryData, index: number) => ({
      image: "/assets/images/product.png",
      name: category.category,
      value: category.quantity_sold.toString(),
      increase: index % 2 === 0, // TODO: Replace with real growth data when available
      percentage: Math.floor(category.revenue / 1000), // Use revenue as percentage indicator
    })) || [];

  const locationMapData =
    locationsData?.data?.map((location: LocationData) => ({
      country: location.country,
      users: location.users,
      percentage: location.percentage,
    })) || [];

  const transformedProducts =
    topProductsData?.data?.map((product: ProductData) => ({
      image: product.image,
      name: product.title,
      subtitle: `${product.quantity_sold} sold`,
      value: `₦${product.revenue.toLocaleString()}`,
    })) || [];

  return (
    <div className="flex flex-col p-6 gap-y-6 xl:p-8 xl:gap-y-8">
      <h1 className="text-xl/8 font-medium xl:text-2xl">Sales Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingSalesAnalytics ? (
          <div className="col-span-3 flex items-center justify-center h-32">
            <p className="text-[#656565]">Loading analytics...</p>
          </div>
        ) : (
          <>
            <AnalyticsStatsCard
              title="Sales Volume"
              value={
                salesAnalyticsData?.data?.sales_volume?.toLocaleString() || "0"
              }
              percentage={Math.abs(salesAnalyticsData?.data?.sales_growth || 0)}
              increase={salesAnalyticsData?.data?.sales_growth >= 0}
              icon="/assets/icons/box.svg"
            />
            <AnalyticsStatsCard
              title="Conversion Rate"
              value={`${salesAnalyticsData?.data?.conversion_rate || 0}%`}
              percentage={Math.abs(
                salesAnalyticsData?.data?.conversion_growth || 0
              )}
              increase={salesAnalyticsData?.data?.conversion_growth >= 0}
              icon="/assets/icons/coffee.svg"
            />
            <AnalyticsStatsCard
              title="Profit Margin"
              value={`${salesAnalyticsData?.data?.profit_margin || 0}%`}
              percentage={Math.abs(
                salesAnalyticsData?.data?.profit_growth || 0
              )}
              increase={salesAnalyticsData?.data?.profit_growth >= 0}
              icon="/assets/icons/trending-down.svg"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Category */}
        <Card className="p-6 bg-[#FFFFFF] border-none rounded-[8px]">
          <div className="space-y-1 mb-6">
            <h2 className="text-[20px] leading-[32px] font-medium text-[#292929]">
              Top Category
            </h2>
            <p className="text-sm font-normal text-[#656565]">
              Top Category in This Month
            </p>
          </div>
          <div className="space-y-2">
            {isLoadingCategories ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-[#656565]">Loading categories...</p>
              </div>
            ) : transformedCategories.length > 0 ? (
              transformedCategories.map(
                (category: TransformedCategory, index: number) => (
                  <TopListCard
                    imgUrl={category.image}
                    key={index}
                    title={category.name}
                    value={category.value}
                    increase={category.increase}
                    percentage={category.percentage}
                  />
                )
              )
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-[#656565]">No categories found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6 bg-[#FFFFFF] border-none rounded-[8px]">
          <div className="space-y-1 mb-5">
            <h2 className="text-[20px] leading-[32px] font-medium text-[#292929]">
              Top Product
            </h2>
            <p className="text-sm font-normal text-[#656565]">
              Top product in This Month
            </p>
          </div>
          <div className="space-y-4">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-[#656565]">Loading products...</p>
              </div>
            ) : transformedProducts.length > 0 ? (
              transformedProducts.map(
                (product: TransformedProduct, index: number) => (
                  <TopListCard
                    key={index}
                    title={product.name}
                    subtitle={product.subtitle}
                    value={product.value}
                    imgUrl={product.image}
                  />
                )
              )
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-[#656565]">No products found</p>
              </div>
            )}
          </div>
        </Card>

        {/* User Location */}
        <Card className="p-6 bg-white rounded-[8px] shadow-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h2 className="text-lg/6 font-semibold xl:text-xl/8">
              User Location
            </h2>
            <Select defaultValue="this-week">
              <SelectTrigger className="w-[180px] bg-white border-[#EEEEEE]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-stretch justify-between h-fit">
            <div className="h-[362px]">
              {isLoadingLocations ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#656565]">Loading locations...</p>
                </div>
              ) : (
                <WorldMapEnhanced data={locationMapData} />
              )}
            </div>
            <div className="flex-between gap-x-4 mt-6">
              {isLoadingLocations ? (
                <div className="flex items-center justify-center w-full">
                  <p className="text-[#656565]">Loading country stats...</p>
                </div>
              ) : locationMapData.length > 0 ? (
                locationMapData
                  .slice(0, 3)
                  .map((location: LocationData, index: number) => (
                    <CountryStats
                      key={index}
                      id={index + 1}
                      imgUrl={`/assets/images/${getFlagImage(
                        location.country
                      )}-flag.png`}
                      country={location.country}
                      percentage={location.percentage}
                      usersCount={location.users}
                    />
                  ))
              ) : (
                fallbackUserLocation.map((location) => (
                  <CountryStats key={location.id} {...location} />
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Most Visited Pages */}
        <Card className="p-6 min-h-[580px] bg-white rounded-[8px] shadow-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h2 className="text-lg/6 font-semibold xl:text-xl/8">
              Most Visited Page
            </h2>
            <Select defaultValue="this-week">
              <SelectTrigger className="w-[180px] bg-white border-[#EEEEEE]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <VisitedPagesPieChart />
          </div>
        </Card>
      </div>

      {/* Latest Orders */}
      <SimpleOrderTable title="Latest Order" />
    </div>
  );
}

export default Page;
