"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ReviewProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  features: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  images: string[];
  image_public_ids: string[];
  status: string;
  type: string;
  shop_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

interface ReviewUser {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  email: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  role: string;
  is_active: number;
  city: string;
  state: string;
  country: string;
  profile_photo: string;
  google_id: string | null;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  images: string[];
  image_public_ids: string[];
  rating: number;
  created_at: string;
  updated_at: string;
  product: ReviewProduct;
  user: ReviewUser;
}

interface ReviewsResponse {
  status: string;
  message: string;
  data: Review[];
}

const fetchReviews = async (): Promise<ReviewsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/reviews`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};