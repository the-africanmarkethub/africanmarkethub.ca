export default interface CheckoutPayload {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethodId: number;
  total: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
