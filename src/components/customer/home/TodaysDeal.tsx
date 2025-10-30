"use client";
import React from "react";
import ItemCard from "./ItemCard";
import { Product } from "@/types/customer/product.types";
import { useProductDeals } from "@/hooks/customer/useProductDeals";

function convertDealToProduct(deal: any): Product {
  return {
    id: deal.product.id,
    title: deal.product.title,
    slug: deal.product.slug,
    description: deal.product.description,
    features: "",
    sales_price: deal.product.sales_price,
    regular_price: deal.product.regular_price,
    quantity: deal.product.quantity,
    notify_user: deal.product.notify_user,
    images: deal.product.images,
    image_public_ids: deal.product.image_public_ids,
    status: deal.product.status,
    type: deal.product.type,
    shop_id: deal.product.shop_id,
    category_id: deal.product.category_id,
    views: deal.product.views,
    created_at: deal.product.created_at,
    updated_at: deal.product.updated_at,
    category: {
      id: deal.product.category_id,
      name: "Category",
      image: "",
      image_public_id: "",
      slug: "",
      description: "",
      status: "active",
      parent_id: "",
      created_at: "",
      updated_at: "",
    },
    shop: {
      id: deal.product.shop_id,
      name: "Shop",
      slug: "",
      address: "",
      type: "",
      logo: "",
      logo_public_id: "",
      banner: "",
      banner_public_id: "",
      description: "",
      subscription_id: 1,
      state_id: "",
      city_id: "",
      country_id: "",
      vendor_id: 1,
      category_id: deal.product.category_id,
      status: "active",
      created_at: "",
      updated_at: "",
    },
    variations: deal.product.variations || [],
    reviews: deal.product.reviews || [],
    average_rating: deal.product.average_rating || 0,
  };
}

export default function TodaysDeal() {
  const { data: dealsResponse, isLoading, error } = useProductDeals();

  if (isLoading) {
    return (
      <section className="my-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Today&apos;s Deal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse h-64 rounded-lg"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (
    error ||
    !dealsResponse?.data ||
    dealsResponse?.data?.length === 0 ||
    dealsResponse?.status === "error"
  ) {
    return (
      <section className="my-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Today&apos;s Deal
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            No deal products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  const deals = dealsResponse.data.map(convertDealToProduct);

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Today&apos;s Deal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {deals.map((deal) => (
          <ItemCard
            key={deal.id}
            item={deal}
            hasButton={true}
            displayRegular={false}
          />
        ))}
      </div>
    </section>
  );
}
