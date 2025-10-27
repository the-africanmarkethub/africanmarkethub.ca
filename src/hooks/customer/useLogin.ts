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
        email?: string[];
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
      console.error("Login failed:", error);

      // Handle specific error responses
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage = "Login failed. Please try again.";

      if (status === 401) {
        // Invalid password
        errorMessage =
          responseData?.message ||
          "Invalid password. Please check your password and try again.";
      } else if (status === 422) {
        // Invalid email (user doesn't exist)
        if (responseData?.errors?.email) {
          errorMessage =
            "Email not found. Please check your email or sign up for a new account.";
        } else {
          errorMessage = responseData?.message || "Invalid email address.";
        }
      } else if (status === 400) {
        // Bad request
        errorMessage =
          responseData?.message || "Please check your input and try again.";
      } else if (status && status >= 500) {
        // Server error
        errorMessage = "Server error. Please try again later.";
      } else {
        // Fallback to response message or default
        errorMessage = responseData?.message || errorMessage;
      }

      toast.error(errorMessage);
    },
  });
}
