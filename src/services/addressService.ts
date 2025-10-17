import APICall from "@/utils/ApiCall";

export interface Address {
  id: number;
  customer_id: number;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  address_label: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressPayload {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  address_label: string;
}

export const createAddress = async (payload: CreateAddressPayload) => {
  const res = await APICall("/customer/address/create", "POST", payload);
  return res;
};

export const getAddresses = async () => {
  const res = await APICall("/customer/addresses", "GET");
  return res;
};

export const updateAddress = async (
  id: number,
  payload: Partial<CreateAddressPayload>
) => {
  const res = await APICall(`/customer/address/update/${id}`, "PUT", {
    ...payload,
    address_id: id,
  });
  return res;
};

export const deleteAddress = async (id: number) => {
  const res = await APICall(`/customer/address/delete/${id}`, "DELETE", {
    address_id: id,
  });
  return res;
};
