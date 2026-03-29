import api from "./axios";

/**
 * Tracks orders using email, order ID, or both.
 */
export const trackOrder = async (email?: string, orderId?: string) => {
  const res = await api.post("order/track", {
    email: email || undefined,
    order_id: orderId || undefined,
  });
  return res.data;
};
