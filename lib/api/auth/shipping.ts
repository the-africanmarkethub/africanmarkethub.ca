import Address from "@/interfaces/address";
import api from "../axios";
 

export async function updateAddress(payload: Address): Promise<Address> {
  const response = await api.post(`/profile/address/save`, payload);
  return response.data.data;
}

export async function getAddress(): Promise<Address> {
  const response = await api.get(`/profile/address`); 
  return response.data.data;
}
