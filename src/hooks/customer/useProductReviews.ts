import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";

export interface ReviewUser {
  id: number;
  name: string;
  last_name: string;
  profile_photo?: string;
}

export interface ReviewProduct {
  id: number;
  title: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  images: string[] | null;
  rating: number;
  created_at: string;
  user: ReviewUser;
  product: ReviewProduct;
}

// Define error response type
interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

async function fetchProductReviews(): Promise<ProductReview[]> {
  try {
    const response = await APICall("/products/reviews", "GET");

    // If APICall returns null (due to error handling), throw an error
    if (!response) {
      throw new Error("Failed to fetch product reviews");
    }

    return response.data || [];
  } catch (error) {
    // Re-throw the error to be handled by the query
    throw error;
  }
}

/**
 * Hook to fetch product reviews from the API
 *
 * @returns {Object} Query result containing:
 * - data: Array of ProductReview objects
 * - isLoading: Boolean indicating if the request is in progress
 * - error: Error object if the request failed
 * - refetch: Function to manually refetch the data
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data: reviews, isLoading, error } = useProductReviews();
 *
 *   if (isLoading) return <div>Loading reviews...</div>;
 *   if (error) return <div>Error loading reviews</div>;
 *
 *   return (
 *     <div>
 *       {reviews?.map(review => (
 *         <div key={review.id}>
 *           <p>{review.comment}</p>
 *           <p>Rating: {review.rating}/5</p>
 *           <p>By: {review.user.name} {review.user.last_name}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProductReviews() {
  const queryClient = useQueryClient();

  const query = useQuery<ProductReview[], ErrorResponse>({
    queryKey: [QUERY_KEY.productReviews],
    queryFn: fetchProductReviews,
    initialData: () => {
      return queryClient.getQueryData([QUERY_KEY.productReviews]) as
        | ProductReview[]
        | undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache duration
  });

  return query;
}
