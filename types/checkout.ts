export interface CheckoutPayload {
  order_item_id: number[];
  address_id: number;
}

export interface CheckoutResponse {
  status: string;
  message?: string;
  payment_link?: string;
  payment_qr_code?: string;
  data?: any;
}