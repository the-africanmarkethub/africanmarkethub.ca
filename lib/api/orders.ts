import {
  OrderStatsType,
  CustomerOrdersResponse,
  OrderListResponse,
} from "@/interfaces/orders";
import api from "./axios";

export async function listOrders(
  limit: number,
  offset: number,
  search?: string,
  status?: string
) {
  const response = await api.get("/orders", {
    params: { limit, offset, search, status },
  });
  return response.data as CustomerOrdersResponse;
}
export async function listVendorOrders(
  limit: number,
  offset: number,
  search?: string,
  status?: string
) {
  const response = await api.get("/orders", {
    params: { limit, offset, search, status },
  });
  return response.data as OrderListResponse;
}

export async function getOrderDetail(orderId: string) {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
}

export async function changeOrderStatus(orderId: number, status: string) {
  const response = await api.put(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
}

export async function changeOrderPaymentStatus(
  orderId: number,
  status: string
) {
  const response = await api.put(`/orders/${orderId}/payment-status`, {
    payment_status: status,
  });
  return response.data;
}

export async function orderStats(): Promise<OrderStatsType> {
  const response = await api.get<OrderStatsType>(`/orders/stats`);
  return response.data;
}

export async function bookingStats(): Promise<OrderStatsType> {
  const response = await api.get<OrderStatsType>(`/bookings/stats`);
  return response.data;
}

export async function getSalesGraph(period: string) {
  const response = await api.get(`/stats/graph?start_date=${period}`);
  return response;
}

export async function getStats(period: string) {
  const response = await api.get(`/stats?start_date=${period}`);
  return response.data;
}

export async function submitReview(payload: FormData) {
  const response = await api.post("/customer/items/review/create", payload, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });

  return response.data;
}
