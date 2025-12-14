import Address from "@/interfaces/address";
import api from "../axios";

export async function updateAddress(
  payload: { address_id?: number, street_address: string; city: string; state: string, country: string; zip_code: string, phone: string, address_label: string }
): Promise<Address> {
  const response = await api.post(`/customer/address/save`, payload);
  return response.data.data;
}

export async function getAddresses(): Promise<Address[]> {
  const response = await api.get(`/customer/address`);
  return response.data.data;
}