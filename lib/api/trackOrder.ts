import api from "./axios";

export const trackOrder = async (email: string) => {
  const res = await api.get("track-orders", {
    params: { email },
  });
  return res.data;
};
