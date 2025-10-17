"use client";
import AllCategoriesDisplay from "@/components/categories/AllCategoriesDisplay";
import useCategories from "@/hooks/useCategories";
import React from "react";

export default function AllServiceCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <AllCategoriesDisplay
      bannerImage="/img/serviceCategory.svg"
      bannerTitle="Top-Notch Services"
      bannerSubtitle="Find the Best Professionals"
      bannerButtonText="Hire Now!"
      pageTitle="All Service Categories"
      categoryLinkPrefix="service"
      categories={categories}
      isLoading={isLoading}
      error={error}
    />
  );
}
