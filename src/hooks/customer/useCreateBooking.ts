import { useMutation, useQueryClient } from "@tanstack/react-query";
import APICall from "@/utils/ApiCall";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import { toast } from "sonner";

export interface CreateBookingRequest {
  ticket_id: string;
  delivery_method:
    | "online"
    | "virtual"
    | "remote"
    | "onsite"
    | "pickup"
    | "delivery"
    | "hybrid";
  start_date: string;
  end_date: string;
  address?: string;
  amount: number;
}

export interface CreateBookingResponse {
  status: string;
  message: string;
  payment_link: string;
  payment_qr_code: string;
}

export async function createBooking(
  data: CreateBookingRequest
): Promise<CreateBookingResponse> {
  const response = await APICall("/customer/bookings", "POST", data);
  return response;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<CreateBookingResponse, unknown, CreateBookingRequest>({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: (data) => {
      toast.success("Booking created successfully:", data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.bookings] });
      // Don't show toast here - let the component handle the payment flow
    },
    onError: (error: unknown) => {
      console.error("Failed to create booking:", error);

      const err = error as {
        response?: { status: number; data?: { message?: string } };
      };
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to create booking. Please try again.";

      toast.error(errorMessage);
    },
  });
}
