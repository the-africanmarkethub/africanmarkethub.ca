import api from "../axios";

export async function getVendorEarnings() {
  const response = await api.get("/vendor/earnings");
  return response.data;
}
export async function getVendorEarningsGraph() {
  const response = await api.get("/vendor/graph");
  return response.data;
}
export async function getVendorBank() {
  const response = await api.get("/vendor/settlement-account");
  return response.data;
}
export async function withdrawRequest(amount: number) {
  const response = await api.post("/vendor/withdrawal/request", { amount });
  return response.data;
}

export async function getWithdrawalHistory(offset: number, limit: number) {
  const response = await api.get("/vendor/withdrawal/history", {
    params: { offset, limit },
  });
  return response.data;
}
