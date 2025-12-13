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
  created_at: string;
  updated_at: string;
}

export interface AddressResponse {
  data: Address[];
  status: string;
  message: string;
}

export interface CreateAddressPayload {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
}

export interface CreateAddressResponse {
  status: string;
  message: string;
  data: Address;
}

export interface UpdateAddressPayload extends CreateAddressPayload {
  address_label?: string;
}

export interface DeleteAddressResponse {
  status: string;
  message: string;
}