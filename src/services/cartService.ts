import { AddToCartPayload } from "@/types/customer/cart.types";
import APICall from "@/utils/ApiCall";

export const getCart = async () => {
  const res = await APICall("/customer/cart", "GET");
  return res;
};

export const addToCart = async (payload: AddToCartPayload) => {
  const formData = new FormData();
  payload.cart_items.forEach((item, index) => {
    formData.append(
      `cart_items[${index}][product_id]`,
      String(item.product_id)
    );
    formData.append(`cart_items[${index}][quantity]`, String(item.quantity));
    if (item.size_id) {
      formData.append(`cart_items[${index}][size_id]`, String(item.size_id));
    }
    if (item.color_id) {
      formData.append(`cart_items[${index}][color_id]`, String(item.color_id));
    }
  });

  const res = await APICall("/customer/cart/create", "POST", formData, true);
  return res;
};

export const updateCartItem = async ({
  quantity,
  productId,
  sizeId,
  colorId,
}: {
  quantity: number;
  productId: number;
  sizeId?: number;
  colorId?: number;
}) => {
  // Use the create endpoint for updates as well
  // The API will update if the product already exists in cart
  const formData = new FormData();
  formData.append(`cart_items[0][product_id]`, String(productId));
  formData.append(`cart_items[0][quantity]`, String(quantity));
  if (sizeId) {
    formData.append(`cart_items[0][size_id]`, String(sizeId));
  }
  if (colorId) {
    formData.append(`cart_items[0][color_id]`, String(colorId));
  }
  
  const res = await APICall("/customer/cart/create", "POST", formData, true);
  return res;
};

export const deleteCartItem = async (itemId: number) => {
  const res = await APICall(`/customer/cart/delete/${itemId}`, "DELETE");
  return res;
};
