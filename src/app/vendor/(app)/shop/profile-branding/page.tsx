"use client";
import { useState } from "react";
import { PageHeader } from "@/components/vendor/page-header";
import ShopDetails from "@/components/vendor/shop/shop-details";
import ShoppingHero from "@/components/vendor/shop/shopping-hero";
import { useShopDetails } from "@/hooks/vendor/useShopDetails";
import { type ShopDetail } from "@/components/vendor/shop/shop-details";
import { type EditShopFormData } from "@/components/vendor/shop/edit-shop-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/vendor/ui/tabs";
import EditShopForm from "@/components/vendor/shop/edit-shop-form";
import VendorProductsTabContent from "@/components/vendor/shop/vendor-products-tab-content";
import ReviewTabContent from "@/components/vendor/shop/review-tab-content";
import SubscriptionTabContent from "@/components/vendor/shop/subscription-tab-content";

interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  type: string;
  logo: string;
  banner: string;
  status: string;
  vendor: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  city?: {
    id: number;
    name: string;
  };
  state?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    type: string;
  };
}

export default function ShopPage() {
  const { data } = useShopDetails();
  const shops = data?.shops || [];
  const shopData = shops[0]; // Get the first shop from the array

  const details: ShopDetail[] = shops.map((shop: Shop) => ({
    name: shop.name,
    description: shop.description,
    address: shop.address,
    logo: shop.logo,
    email: shop.vendor?.email ?? "",
    phone: shop.vendor?.phone ?? "",
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleEditShop = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (data: EditShopFormData) => {
    console.log("Saving shop data:", data);
    // Here you would typically save the data to your backend
    setIsEditing(false);
  };

  if (isEditing) {
    const initialFormData = shopData ? {
      name: shopData.name || "",
      type: shopData.type || "",
      description: shopData.description || "",
      address: shopData.address || "",
      logo: shopData.logo || "",
      banner: shopData.banner || "",
      city: shopData.city?.name || "",
      state: shopData.state?.name || "",
      country: shopData.country || "",
      email: shopData.vendor?.email || "",
      phone: shopData.vendor?.phone || "",
    } : undefined;

    return (
      <main className="p-0 md:p-8">
        <div className="hidden pb-8 md:block">
          <PageHeader title="Edit Shop Profile & Branding" />
        </div>
        <EditShopForm 
          onCancel={handleCancel} 
          onSave={handleSave} 
          initialData={initialFormData}
          shopId={shopData?.id}
        />
      </main>
    );
  }

  return (
    <div className="space-y-6 p-6 xl:space-y-8 xl:p-8">
      <PageHeader title="Shop Management" />
      <ShoppingHero onClick={handleEditShop} />
      {details.map((item) => (
        <ShopDetails key={item.id} {...item} />
      ))}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="products"
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="store-policy"
          >
            Store Policy
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="subscription"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger
            className="text-[10px] text-[#656565] font-normal leading-[14px] data-[state=active]:bg-transparent data-[state=active]:text-[#F28C0D] md:text-[16px] md:leading-[22px]"
            value="reviews"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <VendorProductsTabContent />
        </TabsContent>

        <TabsContent value="store-policy">Store Ploicy</TabsContent>

        <TabsContent value="subscription" className="mt-0">
          <SubscriptionTabContent />
        </TabsContent>

        <TabsContent value="reviews" className="mt-0">
          <ReviewTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
