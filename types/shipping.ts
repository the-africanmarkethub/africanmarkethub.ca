export interface ShippingRatePayload {
  to_name: string;
  to_lastname: string;
  to_email: string;
  to_phone: string;
  to_street: string;
  to_city: string;
  to_state: string;
  to_zip: string;
  to_country: string;
  products: {
    id: number;
    quantity: number;
  }[];
}

export interface ShippingRate {
  postage_type: string;
  total: number;
  currency: string;
  delivery_days: string;
}

export interface ShippingRateResponse {
  status: string;
  rates: ShippingRate;
}