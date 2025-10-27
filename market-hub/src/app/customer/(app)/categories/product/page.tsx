"use client";
import AllCategoriesDisplay from "@/components/customer/categories/AllCategoriesDisplay";
import useCategories from "@/hooks/customer/useCategories";
import React from "react";

export default function AllProductCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <AllCategoriesDisplay
      bannerImage="/img/productCategory.svg"
      bannerTitle="Viva!"
      bannerSubtitle="Your Fashion Choice"
      bannerButtonText="Shop Now!"
      pageTitle="All Product Categories"
      categoryLinkPrefix="product"
      categories={categories}
      isLoading={isLoading}
      error={error}
    />
  );
}
