import api from "../axios";

export async function saveBankInfo(payload: any) {
  const response = await api.post("/vendor/settlement-account/create", payload);
  return response.data;
}
