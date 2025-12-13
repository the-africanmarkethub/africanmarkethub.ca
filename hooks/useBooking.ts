"use client";

import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BookingPayload {
  ticket_id: string;
  delivery_method: 'virtual' | 'physical';
  start_date: string;
  end_date: string;
  address?: string;
  amount: number;
}

export interface BookingResponse {
  status: string;
  message: string;
  payment_link: string;
  payment_qr_code: string;
}

export const useCreateBooking = () => {
  return useMutation<BookingResponse, Error, BookingPayload>({
    mutationFn: async (payload: BookingPayload) => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append('ticket_id', payload.ticket_id);
      formData.append('delivery_method', payload.delivery_method);
      formData.append('start_date', payload.start_date);
      formData.append('end_date', payload.end_date);
      if (payload.address && payload.delivery_method === 'physical') {
        formData.append('address', payload.address);
      }
      formData.append('amount', payload.amount.toString());

      console.log('Creating booking with payload:', payload);

      const response = await fetch(`${API_BASE_URL}/customer/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Booking creation error:', error);
        throw new Error(error.message || 'Failed to create booking');
      }

      return response.json();
    },
  });
};