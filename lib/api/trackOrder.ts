import api from "./axios";

export const trackOrder = async (email: string) => {
  const res = await api.get("order/track", {
    params: { email },
  });
  return res.data;
};
