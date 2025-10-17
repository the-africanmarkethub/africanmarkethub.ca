import APICall from "@/utils/ApiCall";

// Types for wishlist operations
export interface CreateWishlistItemPayload {
  product_id: number;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    description: string;
    regular_price: string;
    sales_price: string;
    images: string[];
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

export interface WishlistResponse {
  data: WishlistItem[];
  message: string;
  total: number;
}

// Create a new wishlist item
export async function createWishlistItem(payload: CreateWishlistItemPayload) {
  const response = await APICall("/customer/wishlist/create", "POST", payload);
  return response;
}

// Get user's wishlist
export async function getWishlist(): Promise<WishlistResponse> {
  const response = await APICall("/customer/wishlists", "GET");
  return response;
}

// Remove item from wishlist
export async function removeWishlistItem(wishlistItemId: number) {
  const response = await APICall(
    `/customer/wishlist/delete/${wishlistItemId}`,
    "DELETE",
    { wishlist_id: wishlistItemId }
  );
  return response;
}

// // Update wishlist item quantity
// export async function updateWishlistItem(
//   wishlistItemId: number,
//   quantity: number
// ) {
//   const response = await APICall(
//     `/api/v1/customer/wishlists/delete/${wishlistItemId}`,
//     "PUT",
//     { quantity }
//   );
//   return response;
// }
