import api from "./axios";

/**
 * Tracks orders associated with a specific email.
 */
export const trackOrder = async (email: string) => {
  const res = await api.post("order/track", {
    email, 
  });
  return res.data;
};
