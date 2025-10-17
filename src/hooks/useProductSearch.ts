import { useMutation } from "@tanstack/react-query";
import APICall, {
  handleNoResultsResponse,
  createEmptyPaginatedResponse,
} from "@/utils/ApiCall";
import { Product } from "@/types/product.types";
import { toast } from "sonner";

interface PaginatedData {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

interface SearchResponse {
  message: string;
  status: string;
  data: PaginatedData;
}

// Define error response type
interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      status?: string;
      data?: PaginatedData;
    };
  };
}

// The function that will be called by the mutation
async function searchProducts(query: string): Promise<SearchResponse> {
  try {
    // Sending the payload as a JSON object
    const response = await APICall("/product/search", "POST", { query });

    // If APICall returns null (due to error handling), throw an error
    if (!response) {
      throw new Error("Search request failed");
    }

    return response;
  } catch (error) {
    // Use the generic utility to handle 404 "No products and services found"
    const noResultsResponse = handleNoResultsResponse(
      error,
      "No products and services found",
      {
        message: "No products and services found",
        status: "error",
        data: createEmptyPaginatedResponse<Product>().data,
      }
    );

    if (noResultsResponse) {
      return noResultsResponse;
    }

    // Re-throw other errors
    throw error;
  }
}

export function useProductSearch() {
  return useMutation<SearchResponse, ErrorResponse, string>({
    mutationFn: searchProducts,
    onSuccess: (data) => {
      console.log("Search successful:", data);
    },
    onError: (error) => {
      console.error("Search failed:", error);

      // Handle specific error responses
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Search failed. Please try again.";

      if (status === 400) {
        errorMessage = "Please enter a valid search term.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (status === 401) {
        errorMessage = "Authentication required. Please sign in.";
      } else {
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}
