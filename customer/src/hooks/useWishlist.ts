import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEY } from "@/constants/queryKeys";
import {
  createWishlistItem,
  getWishlist,
  removeWishlistItem,
  //   updateWishlistItem,
  CreateWishlistItemPayload,
} from "@/services/wishlistService";

// Error response type
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

// Hook to get user's wishlist
export function useWishlist() {
  return useQuery({
    queryKey: [QUERY_KEY.wishlist],
    queryFn: getWishlist,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated(), // Only fetch if authenticated
  });
}

// Hook to add item to wishlist
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWishlistItemPayload) => {
      if (!isAuthenticated()) {
        throw new Error("User not authenticated");
      }
      return createWishlistItem(payload);
    },
    onSuccess: () => {
      toast.success("Product added to wishlist successfully!");
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.wishlist] });
    },
    onError: (error: unknown) => {
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        toast.error("Please log in to add items to your wishlist", {
          description: "You need to be logged in to use the wishlist feature.",
          action: {
            label: "Sign In",
            onClick: () => {
              window.location.href = "/sign-in";
            },
          },
        });
        return;
      }

      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.message
          : "Failed to add to wishlist";
      toast.error(errorMessage || "Failed to add to wishlist");
    },
  });
}

// Hook to remove item from wishlist
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wishlistItemId: number) => {
      if (!isAuthenticated()) {
        throw new Error("User not authenticated");
      }
      return removeWishlistItem(wishlistItemId);
    },
    onSuccess: () => {
      toast.success("Product removed from wishlist successfully!");
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.wishlist] });
    },
    onError: (error: unknown) => {
      if (
        error instanceof Error &&
        error.message === "User not authenticated"
      ) {
        toast.error("Please log in to manage your wishlist", {
          description: "You need to be logged in to use the wishlist feature.",
          action: {
            label: "Sign In",
            onClick: () => {
              window.location.href = "/sign-in";
            },
          },
        });
        return;
      }

      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.message
          : "Failed to remove from wishlist";
      toast.error(errorMessage || "Failed to remove from wishlist");
    },
  });
}

// Hook to update wishlist item quantity
// export function useUpdateWishlistItem() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       wishlistItemId,
//       quantity,
//     }: {
//       wishlistItemId: number;
//       quantity: number;
//     }) => {
//       if (!isAuthenticated()) {
//         throw new Error("User not authenticated");
//       }
//       return updateWishlistItem(wishlistItemId, quantity);
//     },
//     onSuccess: () => {
//       toast.success("Wishlist updated successfully!");
//       // Invalidate and refetch wishlist
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEY.wishlist] });
//     },
//     onError: (error: unknown) => {
//       if (error instanceof Error && error.message === "User not authenticated") {
//         toast.error("Please log in to manage your wishlist", {
//           description: "You need to be logged in to use the wishlist feature.",
//           action: {
//             label: "Sign In",
//             onClick: () => {
//               window.location.href = "/sign-in";
//             },
//           },
//         });
//         return;
//       }

//       const errorMessage =
//         error && typeof error === "object" && "response" in error
//           ? (error as ErrorResponse)?.response?.data?.message
//           : "Failed to update wishlist";
//       toast.error(errorMessage || "Failed to update wishlist");
//     },
//   });
// }
