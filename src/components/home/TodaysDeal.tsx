import React from "react";
import ItemCard from "./ItemCard";
import { Product } from "@/types/product.types";

// Convert placeholderDeals to Product-like objects for ProductCard
const placeholderDeals: Product[] = [
  {
    id: 1,
    title: "Ankara gown",
    slug: "ankara-gown",
    description: "Delicious croissants",
    features: "",
    sales_price: "141.19",
    regular_price: "200.00",
    quantity: 10,
    notify_user: 0,
    images: ["/img/placeholder-deal1.jpg"],
    image_public_ids: [],
    status: "active",
    type: "food",
    shop_id: 1,
    category_id: 1,
    views: 100,
    created_at: "",
    updated_at: "",
    category: {
      id: 1,
      name: "Food",
      image: "",
      image_public_id: "",
      slug: "food",
      description: "",
      status: "active",
      parent_id: "",
      created_at: "",
      updated_at: "",
    },
    shop: {
      id: 1,
      name: "Shop 1",
      slug: "shop-1",
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
      category_id: 1,
      status: "active",
      created_at: "",
      updated_at: "",
    },
    variations: [],
    reviews: [],
    average_rating: 4,
  },
  // ...repeat for other deals, changing id, images, etc...
];

export default function TodaysDeal() {
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Today&apos;s Deal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {placeholderDeals.map((deal) => (
          <ItemCard key={deal.id} item={deal} hasButton={true} displayRegular={false} />
        ))}
      </div>
    </section>
  );
}
