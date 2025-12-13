"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ShopCategory {
  id: number;
  name: string;
  type: string;
  image: string;
  image_public_id: string;
  slug: string;
  description: string;
  status: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

interface ShopLocation {
  id: number;
  name: string;
  country_id?: number;
  state_id?: number;
  created_at: string;
  updated_at: string;
}

interface ShopVendor {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  email: string;
  email_verified_at: string;
  phone_verified_at: string;
  role: string;
  is_active: number;
  city: string;
  state: string;
  country: string;
  profile_photo: string;
  google_id: string | null;
  referral_code: string;
  referred_by: string | null;
  fcm_token: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Shop {
  id: number;
  name: string;
  slug: string;
  address: string;
  type: "products" | "services";
  logo: string;
  logo_public_id: string;
  banner: string;
  banner_public_id: string;
  description: string;
  subscription_id: number;
  state_id: string;
  city_id: string;
  country_id: string;
  vendor_id: number;
  category_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  state: ShopLocation;
  city: ShopLocation;
  category: ShopCategory;
  vendor: ShopVendor;
}

interface VendorShopsResponse {
  message: string;
  status: string;
  shops: Shop[];
}

const fetchVendorShops = async (): Promise<VendorShopsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/vendor/shop`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor shops");
  }

  return response.json();
};

export const useVendorShops = () => {
  return useQuery({
    queryKey: ["vendorShops"],
    queryFn: fetchVendorShops,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { Shop, VendorShopsResponse };