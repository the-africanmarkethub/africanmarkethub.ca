import api from "../axios";

export default async function verifySubscriptionPayment(code: string) {
  const { data } = await api.get(`subscription/verify`);
  return data;
}

export async function listSubscriptions() {
  const { data } = await api.get("/subscriptions");
  return data.data;
}