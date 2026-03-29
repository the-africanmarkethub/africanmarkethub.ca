import api from "./axios";

/**
 * Tracks orders associated with a specific email.
 */
export const trackOrder = async (email: string, orderId?: string) => {
  const res = await api.post("order/track", {
    email,
    order_id: orderId, // This will be sent as undefined if not provided, which is fine
  });
  return res.data;
};
