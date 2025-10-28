import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/services/authService";
import { LoginData, User } from "@/types/customer/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { QUERY_KEY } from "@/constants/customer/queryKeys";

// Define error response type
interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: {
        [key: string]: string[];
      };
    };
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password, ip_address, device_name }: LoginData) => {
      return loginUser({ email, password, ip_address, device_name });
    },
    onSuccess: (userData: User) => {
      // Check if user role is customer
      const userRole = userData.user?.role;

      if (userRole !== "customer") {
        toast.error("Access denied. This application is for customers only.");
        // Clear any stored data and don't proceed with login
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        return;
      }

      // Store both token and user data to localStorage
      localStorage.setItem("accessToken", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Update React Query cache
      queryClient.setQueryData(["user"], userData);
      // Invalidate and refetch the profile query to update the NavBar
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.profile] });
      toast.success("Login successful!");
      router.push("/"); // Redirect to home page or dashboard
    },
    onError: (error: ErrorResponse) => {
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Login failed. Please try again.";

      if (status === 422 && responseData?.errors) {
        // Extract first validation error
        const firstErrorKey = Object.keys(responseData.errors)[0];
        const firstError = responseData.errors[firstErrorKey];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      }

      toast.error(errorMessage);
    },
  });
}
