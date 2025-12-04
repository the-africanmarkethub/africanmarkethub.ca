"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  images: string[];
  delivery_method: string;
  pricing_model: string;
  available_from: string;
  available_to: string;
  available_days: string[];
  estimated_delivery_time: string;
}

interface Customer {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  profile_photo: string;
}

interface Vendor {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  profile_photo: string;
}

interface Booking {
  id: number;
  customer_id: number;
  vendor_id: number;
  service_id: number;
  address_id: number | null;
  total: string;
  delivery_method: string;
  delivery_status: string;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  payment_status: string;
  vendor_payment_settlement_status: string;
  payment_reference: string | null;
  cancel_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
  service: Service;
  customer: Customer;
  vendor: Vendor;
  address: any;
}

interface BookingsResponse {
  current_page: number;
  data: Booking[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

const fetchBookings = async (page: number = 1): Promise<BookingsResponse> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/bookings?page=${page}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
};

export const useBookings = (page: number = 1) => {
  return useQuery({
    queryKey: ["bookings", page],
    queryFn: () => fetchBookings(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Cancel booking hook
interface CancelBookingPayload {
  cancel_reason: string;
}

const cancelBooking = async (bookingId: number, payload: CancelBookingPayload): Promise<any> => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/canceled/${bookingId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel booking");
  }

  return response.json();
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: number; payload: CancelBookingPayload }) => 
      cancelBooking(bookingId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel booking");
    },
  });
};

