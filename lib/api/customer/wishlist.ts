import api from "../axios";

export async function listWishlists() {
  const { data } = await api.get(`/customer/wishlists`);
  return data;
}

export interface SaveWishlistPayload {
  product_id: number;
  quantity?: number; // optional, default = 1
}

export async function saveWishlist(payload: SaveWishlistPayload) {
  const { data } = await api.post(`/customer/wishlist/create`, payload);

  return data;
}

// @todo
export async function removeWishlist(wishlistId: number) {
  const { data } = await api.delete(`/customer/wishlist/delete/${wishlistId}`);

  return data;
}
