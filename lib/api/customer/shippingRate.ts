import { ShippingRatePayload } from "@/interfaces/shippingRate";
import api from "../axios";

export const shippingRate = async (payload: ShippingRatePayload) => {
  const res = await api.post("/shipping/rates", {
    ...payload,
    device_name: navigator.userAgent,
  });

  return res.data;
};
